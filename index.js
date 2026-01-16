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
        .setName("product")
        .setDescription("Product purchased")
        .setRequired(true)
        .addChoices(
          { name: "PC Optimization", value: "PC Optimization" },
          { name: "VIP", value: "VIP" },
          { name: "Perm Booster", value: "Perm Booster" },
          { name: "Server Promo", value: "Server Promo" },
          { name: "Real Members", value: "Real Members" },
          { name: "Discord Service", value: "Discord Service" }
        )
    )
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Your experience / review")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("stars")
        .setDescription("Rating")
        .setRequired(true)
        .addChoices(
          { name: "⭐", value: "1" },
          { name: "⭐⭐", value: "2" },
          { name: "⭐⭐⭐", value: "3" },
          { name: "⭐⭐⭐⭐", value: "4" },
          { name: "⭐⭐⭐⭐⭐", value: "5" }
        )
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
  await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "vouch") {
    const product = interaction.options.getString("product");
    const message = interaction.options.getString("message");
    const stars = interaction.options.getString("stars");
    const proof = interaction.options.getAttachment("proof");

    const starDisplay = "⭐".repeat(Number(stars));

    const embed = new EmbedBuilder()
      .setColor("#9ea4cf")
      .setTitle("Vouch Submitted")
      .setDescription(starDisplay)
      .addFields(
        { name: "Product:", value: product },
        { name: "Vouch:", value: message },
        { name: "Vouched by:", value: `<@${interaction.user.id}>`, inline: true },
        {
          name: "Vouched at:",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`
        }
      )
      .setThumbnail(THUMBNAIL_URL)
      .setFooter({
        text: ".gg/bunkerleaks",
        iconURL: THUMBNAIL_URL
      })
      .setTimestamp();

    if (proof) embed.setImage(proof.url);

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
