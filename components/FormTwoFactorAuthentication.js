import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { loginWith2FA } from '../services/userService.js';
import { download } from '../services/projectService.js';

const FormTwoFactorAuthentication = ({ projectId }) => {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState({});
    const [professional, setProfessional] = useState({});
    const [session, loading] = useSession();

    const checkTwoFactorAuthenticationCode = async () => {
        const code = document.querySelector("#code").value;
        const wrongCode = document.querySelector("#wrong-code");
        const validCode = document.querySelector("#valid-code");
        try {
            const response = await loginWith2FA({"code":code},session.accessToken);
            validCode.hidden = false;
            const token = response.token;
            download(projectId, token);
        } catch(e){
            wrongCode.hidden = false;
        }
    }

    return(
    <>
        <div>
            <h1>Two factor authentication</h1>
            <h2>Enter the code of two factor authentication</h2>
            <input id="code" type="number"></input>
            <button onClick={checkTwoFactorAuthenticationCode}>Submit</button>
            <span hidden style={{color: "red"}} id="wrong-code">Wrong code</span>
            <span hidden style={{color: "green"}} id="valid-code">Valid code</span>
        </div>
    </>
    );
}

export default FormTwoFactorAuthentication;