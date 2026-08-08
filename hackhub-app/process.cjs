const fs = require('fs');
const xlsx = require('xlsx');

try {
  const websitesStr = fs.readFileSync('../codecraft final websites.txt', 'utf-8');
  const websites = websitesStr.split('\n')
    .filter(l => l.trim())
    .map(l => {
      const parts = l.split(' ');
      return parts[parts.length - 1].trim();
    });

  const workbook = xlsx.readFile('../CloneCraft 2026 \u2013 Registration Form (Responses).xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  const teamCol = Object.keys(data[0]).find(k => k.toLowerCase().includes('team'));
  if (!teamCol) {
    console.error("Could not find a team column. Columns are:", Object.keys(data[0]));
    process.exit(1);
  }

  const teams = data.map(r => r[teamCol]).filter(Boolean);

  // Shuffle teams
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teams[i], teams[j]] = [teams[j], teams[i]];
  }

  const dataFileContent = `export const websites = ${JSON.stringify(websites, null, 2)};\n\nexport const teams = ${JSON.stringify(teams, null, 2)};\n`;
  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/clonecraftData.ts', dataFileContent, 'utf-8');
  console.log("Created src/data/clonecraftData.ts");
} catch (e) {
  console.error("Error:", e);
}
