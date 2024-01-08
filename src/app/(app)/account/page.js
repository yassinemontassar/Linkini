import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UsernameForm from "@/components/forms/UsernameForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import prisma from "../../../../lib/db";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";

export default async function AccountPage({searchParams}) {
    const session = await getServerSession(authOptions)
    const desiredUsername = searchParams?.desiredUsername;

    if (!session) {
        redirect('/');
    }
    const page = await prisma.page.findFirst({
        where : {
        owner: session?.user?.email,
        },
    })
    if (page) {
        return (
            <>
                <PageSettingsForm  page={page} user={session.user}/>
                <PageButtonsForm page={page} user={session.user}/>
                <PageLinksForm page={page} user={session.user} />
            </>
        )
    }
    return (
        <div>
            <UsernameForm desiredUsername={desiredUsername} />
        </div>
    );
}