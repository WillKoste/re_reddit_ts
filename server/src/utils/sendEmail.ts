import nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string) {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false,
			auth: {
				user: 'fv3xby5of63ood7g@ethereal.email',
				pass: '9QwUA2AbzEqAHwF5be'
			}
		});

		const info = await transporter.sendMail({
			from: '"Fred Foo *Host*" <foo@example.com>',
			to,
			subject: 'Change Password',
			html: `
        <div>
          <h1>${html}</h1>
        </div>
      `
		});

		console.log({messageSentPercent: info.messageId, previewURLPercents: nodemailer.getTestMessageUrl(info)});
	} catch (err) {
		console.error(err);
	}
}
