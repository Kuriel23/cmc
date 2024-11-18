const { readdir } = require("node:fs");

module.exports = async (client) => {
	readdir("./src/events/", (err, files) => {
		if (err) return console.error(err);
		for (const file of files) {
			const event = require(`../events/${file}`);
			const eventName = file.split(".")[0];
			client.on(eventName, event.bind(null, client));
		}
	});
};
