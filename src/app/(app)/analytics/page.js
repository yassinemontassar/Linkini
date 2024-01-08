import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "../../../../lib/db";
import SectionBox from "@/components/layout/sectionBox";
import Chart from "@/components/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import {differenceInDays, formatISO9075, isToday} from "date-fns";

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions);
    const page = await prisma.page.findUnique({ where: {owner: session.user.email},});
    if (!page) {
      return (
        <div className="flex items-center justify-center p-3 ">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">You dont have a page yet!</p>
          {/* Add any additional content or styling as needed */}
        </div>
      </div>
      )
    }
    const aggregations = await prisma.event.groupBy({
        by: ["uri", "createdAt"],
        _count: {
            id: true,
        },
        where: {
            type: 'view',
            uri: page.uri,
        },
        orderBy: {
            createdAt: 'asc',
          },
    });
    
    const aggregatedResults = {};

    aggregations.forEach((group) => {
        const dateKey = group.createdAt ? new Date(group.createdAt).toISOString().split('T')[0] : null;
    
        if (dateKey) {
            if (aggregatedResults[dateKey]) {
                aggregatedResults[dateKey].count += group._count.id;
            } else {
                aggregatedResults[dateKey] = {
                    _id: dateKey,
                    count: group._count.id,
                };
            }
        }
    });
    
    const transformedResult = Object.values(aggregatedResults);
    
        const clicks = await prisma.event.findMany({ where: {page: page.uri, type: 'click' },});
    if (!session) {
      return redirect('/'); 
    }
  
    return (
        <div>
           <SectionBox>
        <h2 className="text-xl mb-6 text-center">Views</h2>
        <Chart data={transformedResult.map(o => ({
          'date': o._id,
          'views': o.count, 
        }))} />
      </SectionBox> 
      <SectionBox>
        <h2 className="text-xl mb-6 text-center">Clicks</h2>
        {page.links.map(link => (
          <div key={link.title} className="md:flex gap-4 items-center border-t border-gray-200 py-4">
            <div className="text-blue-500 pl-4">
              <FontAwesomeIcon icon={faLink} />
            </div>
            <div className="grow">
              <h3>{link.title || 'no title'}</h3>
              <p className="text-gray-700 text-sm">{link.subtitle || 'no description'}</p>
              <a className="text-xs text-blue-400" target="_blank" href="link.url">{link.url}</a>
            </div>
            <div className="text-center">
              <div className="border rounded-md p-2 mt-1 md:mt-0">
                <div className="text-3xl">
                  {
                    clicks
                      .filter(
                        c => c.uri === link.url
                          && isToday(c.createdAt)
                      )
                      .length
                  }
                </div>
                <div className="text-gray-400 text-xs uppercase font-bold">clicks today</div>
              </div>
            </div>
            <div className="text-center">
              <div className="border rounded-md p-2 mt-1 md:mt-0">
                <div className="text-3xl">
                  {clicks.filter(c => c.uri === link.url).length}
                </div>
                <div className="text-gray-400 text-xs uppercase font-bold">clicks total</div>
              </div>
            </div>
          </div>
        ))}
      </SectionBox>
        </div>
    )
}