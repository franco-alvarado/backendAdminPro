const nodemailer = require('nodemailer');

module.exports = (formulario, subject) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        secureConnection: false,
        auth: {
            user: 'falvarado@zonar.cl',
            pass: '5041Cent93'
        },
        tls: {
            rejectUnauthorized: false,
            ciphers: "SSLv3"
        }
    });
    let html = `
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;height: 100% !important;width: 100% !important;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse !important;mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#87CEFA" align="center" style="mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;border-collapse: collapse !important;mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#87CEFA" align="center" style="padding: 0px 10px 0px 10px;mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;border-collapse: collapse !important;mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src="https://drive.google.com/open?id=14AotdJiX56rvx4xgVqu2yxTIfSUOzZ0n" width="125" height="120" style="display: block; border: 0px;border: 0;
                            height: auto;
                            line-height: 100%;
                            outline: none;
                            text-decoration: none;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;border-collapse: collapse !important;mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;">
                            <p style="margin: 0;">Welcome frankly, as APP we want to welcome you to the new experience of being able to manage your accounting. <br><br> We are only one step away from being able to validate your account and that you can have full access
                                to the system.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse !important;mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;">
                                        <table border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse !important;">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="#87CEFA"><a href="#" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #87CEFA; display: inline-block;">Activate Account</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- COPY -->
                    <tr>
                        <td bgcolor="#FFECD1" align="left" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;">
                            <p style="margin: 0;">Account details: </p>
                            <p>
                                <strong>Name: </strong><span>${formulario.name}</span> <br>
                                <strong>Email: </strong><span>${formulario.email}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 30px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;">
                            <p style="margin: 0;">Thanks for choosing our service,<br>APP</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;border-collapse: collapse !important;mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;">
                    <tr>
                        <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;"> <br>
                            <p style="margin: 0;">Please do not response this email. This is an automatic message.</p>
                        </td>
                    </tr>
                </table>
    
            </td>
        </tr>
    </table>
    </body>`;

    const mailOptions = {
        from: `APP - User Profiling System`,
        to: `${formulario.email}`,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            console.log(err);
        else
            console.log('[MAIL] Message sent to ' + info.envelope.to[0]);
    });
};