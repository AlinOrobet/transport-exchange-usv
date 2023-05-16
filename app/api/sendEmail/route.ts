import {mailOptions, transporter} from "@/app/libs/nodemailer";
import {NextResponse} from "next/server";
import prisma from "@/app/libs/prismadb";

const generateCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

export async function POST(request: Request) {
  const body = await request.json();
  const {email, defaultPassword, type} = body;

  if (type) {
    if (!defaultPassword) {
      const user = await prisma?.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return NextResponse.error();
      }
      const code = generateCode();
      try {
        await transporter.sendMail({
          ...mailOptions,
          to: body.email,
          subject: "Validarea contului",
          html: `<!DOCTYPE html>
          <html>
            <head>
              <title>Email de validare</title>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; margin: 0; padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #f4f4f4;">
                    <table width="600" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #fff; padding: 40px;">
                          <h1 style="margin-top: 0;">Schimbare parola</h1>
                          <p>Salut,</p>
                          <p>Pentru a-ți schimba parola, introdu codul de validare de mai jos:</p>
                          <p style="font-size: 24px; font-weight: bold; color: #008080;">${code}</p>
                          <p>Acest cod va fi valabil pentru următoarele 24 de ore.</p>
                          <p>Îți mulțumim pentru încrederea acordată!</p>
                          <p>Echipa noastră</p>
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
      return NextResponse.json(code);
    }
    try {
      await transporter.sendMail({
        ...mailOptions,
        to: body.email,
        subject: "Confirmarea contului",
        html: `<!DOCTYPE html>
        <html>
          <head>
            <title>Actualizare contului CargoConnect</title>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="background-color: #f4f4f4;">
                  <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #fff; padding: 40px;">
                        <h1 style="margin-top: 0;">CargoConnect</h1>
                        <p>Salut! Echipa ta isi doreste sa i te alaturi pe platforma CargoConnect</p>
                        <p>Pentru a te autentifica cu succes, foloseste urmatoarea parola provizorie: </p>
                        <p style="font-size: 24px; font-weight: bold; color: #008080;">${defaultPassword}</p>
                        <p>Parola se poate schimba in orice moment.</p>
                        <p>Acest cod va fi valabil pentru următoarele 24 de ore.</p>
                        <p>Îți mulțumim pentru încrederea acordată!</p>
                        <p>Echipa noastră</p>
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
  } else {
    const user = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.error();
    }
    const code = generateCode();
    try {
      await transporter.sendMail({
        ...mailOptions,
        to: body.email,
        subject: "Validarea contului",
        html: `<!DOCTYPE html>
        <html>
          <head>
            <title>Email de validare</title>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="background-color: #f4f4f4;">
                  <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #fff; padding: 40px;">
                        <h1 style="margin-top: 0;">Email de validare</h1>
                        <p>Salut,</p>
                        <p>Pentru a-ți activa contul, introdu codul de validare de mai jos:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #008080;">${code}</p>
                        <p>Acest cod va fi valabil pentru următoarele 24 de ore.</p>
                        <p>Îți mulțumim pentru încrederea acordată!</p>
                        <p>Echipa noastră</p>
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
    return NextResponse.json(code);
  }
}
