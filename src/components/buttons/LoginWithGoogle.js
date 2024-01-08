"use client";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
export default function LoginWithGoogle () {
    return (
        <button
                onClick={()=> signIn('google')}
                 className="bg-white shadowtext-center w-full py-4 flex gap-3 items-center justify-center">
                <FontAwesomeIcon icon={faGoogle} className="h-5" />
                <span>Sign In with Google</span>
                </button>
    );
}