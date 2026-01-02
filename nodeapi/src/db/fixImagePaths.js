const db = require("./database");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

// get all image files from uploads folder
const imageFiles = fs.readdirSync(uploadsDir).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
);

console.log(`Found ${imageFiles.length} images in uploads folder:`);
imageFiles.forEach(f => console.log(`  - ${f}`));

// get all destinations from database
db.all("SELECT id, name, coverImagePath FROM destinations", [], (err, rows) => {
    if (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }

    console.log(`\nFound ${rows.length} destinations in database\n`);

    // update each destination with proper image path
    rows.forEach((row, index) => {
        if (index < imageFiles.length) {
            const imagePath = `/uploads/${imageFiles[index]}`;

            db.run(
                "UPDATE destinations SET coverImagePath = ? WHERE id = ?",
                [imagePath, row.id],
                function(updateErr) {
                    if (updateErr) {
                        console.error(`Failed to update ID ${row.id}:`, updateErr.message);
                    } else {
                        console.log(`✓ Updated ID ${row.id} (${row.name})`);
                        console.log(`  Path: ${imagePath}`);
                    }

                    // if this is the last one, exit
                    if (index === rows.length - 1) {
                        console.log("\n Done! All images paths updated.");
                        process.exit(0);
                    }
                }
            );
        }
    });

    if (rows.length === 0) {
        console.log("No destinations to update.");
        process.exit(0);
    }
});