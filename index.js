const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  REST,
  Routes
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const THUMBNAIL_URL =
  "https://cdn.discordapp.com/attachments/1338727950626983936/1338733255905513553/Bunker_Leaks_Text.png?ex=696b1480&is=6969c300&hm=55f4e3cf3b499dca8465d8bb50d3ab8c9a9b50c95e441b57597f7705ec26d837&";

const commands = [
  new SlashCommandBuilder()
    .setName("vouch")
    .setDescription("Leave a vouch for the server")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("What are you vouching for?")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("stars")
        .setDescription("Rating (1–5)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(5)
    )
    .addAttachmentOption(option =>
      option
        .setName("proof")
        .setDescription("Image or video proof (optional)")
        .setRequired(false)
    )
].map(cmd => cmd.toJSON());

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log("Slash command registered");
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "vouch") {
    const message = interaction.options.getString("message");
    const stars = interaction.options.getInteger("stars");
    const proof = interaction.options.getAttachment("proof");

    const starDisplay = "⭐".repeat(stars);

    const embed = new EmbedBuilder()
      .setColor("#9ea4cf")
      .setTitle("New vouch created!")
      .setDescription(starDisplay)
      .addFields(
        { name: "Vouch:", value: message },
        { name: "Vouched by:", value: `<@${interaction.user.id}>` },
        { name: "Vouched at:", value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
      )
      .setThumbnail(THUMBNAIL_URL)
      .setFooter({
        text: ".gg/bunkerleaks •",
        iconURL: THUMBNAIL_URL
      })
      .setTimestamp();

    if (proof) {
      embed.setImage(proof.url);
    }

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
