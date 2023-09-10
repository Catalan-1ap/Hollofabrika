import nodemailer from "nodemailer";


export const mailSender = nodemailer.createTransport(process.env.NODE_ENV === "development" ?
	{
		host: "127.0.0.1",
		port: 25,
		secure: false,
	} : {
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL_MAIL,
			pass: process.env.GMAIL_PASSWORD,
		},
	}, { from: process.env.GMAIL_MAIL, }
);