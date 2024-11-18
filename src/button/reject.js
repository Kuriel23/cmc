const Levels = require("discord-xp");

module.exports = async (interaction) => {
    interaction.fetchReply().delete();
    interaction.reply({ content: "Rejected!", ephemeral: true });
};
