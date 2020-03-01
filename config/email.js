module.exports.email = {
	service: "Mailgun",
	auth: {
		user: process.env.MONGO_USER || "no-reply@gmail.com",
		//pass: "key-b1c1ee97dd7569817804a9e83841a4a3"
		pass: process.env.MONGO_PASSWORD || "123456"
	},
	templateDir: "api/emailTemplates",
	from: "no-reply@cookcook.net",
	testMode: false,
	ssl: true
}
