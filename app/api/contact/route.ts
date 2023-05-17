import {transporter} from "@/app/libs/nodemailer";
import {NextResponse} from "next/server";
const email = process.env.NEXT_PUBLIC_EMAIL;
export async function POST(request: Request) {
  const body = await request.json();
  try {
    await transporter.sendMail({
      from: body.contactEmail,
      to: email,
      subject: "Support",
      html: `<!DOCTYPE html>
      <html>
        <head>
          <title>Support</title>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; margin: 0; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="background-color: #f4f4f4;">
                <table width="600" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color: #fff; padding: 40px;">
                      <h1 style="margin-top: 0;">Cerere suport</h1>
                      <p>Persoana : ${body.contactName}</p>
                      <p>Cu emailul : ${body.contactEmail} solicita: </p>
                      <p>${body.contactMessage}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
    });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json(body);
}
