// // cypress/e2e/travel_journal.cy.js
//
// // Helper: target the top navbar only
// const nav = () => cy.get("header").should("be.visible");
//
// describe("Travel Journal – E2E (selectors only)", () => {
//     beforeEach(() => {
//         cy.visit("/");
//         nav(); // ensure header is rendered before continuing
//     });
//
//     // --- NAV BAR ---------------------------------------------------------------
//     it("shows navbar links on key pages", () => {
//         // Public links on Home (not logged in)
//         nav().find('a[href="/"]').first().should("be.visible");
//         nav().find('a[href="/destinations"]').first().should("be.visible");
//         nav().find('a[href="/add-destination"]').first().should("be.visible");
//         nav().find('a[href="/journals"]').first().should("be.visible");
//
//         // Either Login link or a Logout button should exist
//         cy.get("body").then(($body) => {
//             const hasLoginLink = $body.find('header a[href="/login"]').length > 0;
//             const buttons = $body.find("header button");
//             const hasLogoutButton =
//                 buttons.filter((_, el) => el.textContent.trim() === "Logout").length >
//                 0;
//
//             expect(hasLoginLink || hasLogoutButton).to.be.true;
//         });
//
//         // go to Destinations
//         nav().find('a[href="/destinations"]').first().click();
//         cy.url().should("include", "/destinations");
//
//         // go to Add Destination
//         nav().find('a[href="/add-destination"]').first().click();
//         cy.url().should("include", "/add-destination");
//
//         // go to Login
//         nav().find('a[href="/login"]').first().click();
//         cy.url().should("include", "/login");
//     });
//
//     // --- ADD DESTINATION: VALIDATION ------------------------------------------
//     describe("Add Destination validation", () => {
//         beforeEach(() => {
//             nav().find('a[href="/add-destination"]').first().click();
//             cy.url().should("include", "/add-destination");
//         });
//
//         it("shows errors for empty form", () => {
//             cy.get('form button[type="submit"], form button').last().click();
//
//             cy.get("form").within(() => {
//                 cy.contains("Name is required").should("be.visible");
//                 cy.contains("Country is required").should("be.visible");
//                 cy.contains("City is required").should("be.visible");
//                 cy.contains("Visit date is required").should("be.visible");
//                 cy.contains("Choose 1–5").should("be.visible");
//                 cy.contains("Cover photo is required").should("be.visible");
//             });
//         });
//
//         it("shows name error when others are filled", () => {
//             cy.get("select").eq(0).select("Canada");
//             cy.get("select").eq(1).select("Toronto");
//             cy.get('input[type="date"]').type("2024-01-15");
//             cy.get('input[type="radio"][value="4"]').check({ force: true });
//             cy.get('input[type="file"]').selectFile(
//                 {
//                     contents: Cypress.Buffer.from("test"),
//                     fileName: "test.jpg",
//                     mimeType: "image/jpeg",
//                 },
//                 { force: true }
//             );
//             cy.get('form button[type="submit"], form button').last().click();
//             cy.contains("Name is required").should("be.visible");
//         });
//
//         it("shows cover error when missing", () => {
//             cy.get('input[placeholder*="Canadian Museum"]').type("Test Place");
//             cy.get("select").eq(0).select("Canada");
//             cy.get("select").eq(1).select("Toronto");
//             cy.get('input[type="date"]').type("2024-01-15");
//             cy.get('input[type="radio"][value="3"]').check({ force: true });
//             cy.get('form button[type="submit"], form button').last().click();
//             cy.contains("Cover photo is required").should("be.visible");
//         });
//     });
//
//     // --- ADD DESTINATION: HAPPY PATH ------------------------------------------
//     it("submits a valid destination and shows success banner", () => {
//         nav().find('a[href="/add-destination"]').first().click();
//
//         cy.get('input[placeholder*="Canadian Museum"]').type("Cypress E2E Destination");
//         cy.get("select").eq(0).select("Canada");
//         cy.get("select").eq(1).select("Saskatoon");
//         cy.get('input[type="date"]').type("2024-03-20");
//         cy.get('input[type="radio"][value="5"]').check({ force: true });
//         cy.get("textarea").type("Automated test destination.");
//         cy.get('input[type="file"]').selectFile(
//             {
//                 contents: Cypress.Buffer.from("fake image"),
//                 fileName: "e2e.jpg",
//                 mimeType: "image/jpeg",
//             },
//             { force: true }
//         );
//
//         cy.get('form button[type="submit"], form button').last().click();
//         cy.get(".bg-green-100").should("be.visible");
//     });
//
//     // --- MODERATION: NOT LOGGED IN --------------------------------------------
//     it("moderation shows admin-only message when not logged in", () => {
//         cy.visit("/moderation");
//         nav();
//         cy.get("section .bg-red-100, section .text-slate-600")
//             .first()
//             .should("be.visible");
//     });
//
//     // --- AUTH & MODERATION -----------------------------------------------------
//     it("logs in as admin and reaches moderation", () => {
//         nav().find('a[href="/login"]').first().click();
//
//         cy.get('input[type="email"]').clear().type("test@t.ca");
//         cy.get('input[type="password"]').clear().type("123456Pw");
//
//         cy.get('form button[type="submit"]').click();
//
//         cy.url({ timeout: 10000 }).should("include", "/moderation");
//
//         cy.get("header button").then(($btns) => {
//             const exists = [...$btns].some(
//                 (b) => b.textContent.trim() === "Logout"
//             );
//             expect(exists).to.be.true;
//         });
//     });
//
//     // --- DESTINATIONS: FILTERS -------------------------------------------------
//     it("filters destinations by country and rating with Apply", () => {
//         nav().find('a[href="/destinations"]').first().click();
//
//         cy.get("form select").eq(0).select("Canada");
//         cy.get("form select").eq(1).select("4");
//         cy.get('form button[type="submit"], form button').first().click();
//
//         cy.get("section .grid").should("exist");
//     });
//
//     // --- DESTINATION DETAILS ---------------------------------------------------
//     it("opens first available destination details if any exist", () => {
//         nav().find('a[href="/destinations"]').first().click();
//
//         cy.get('a[href^="/destinations/"]').then(($links) => {
//             if ($links.length > 0) {
//                 cy.wrap($links.eq(0)).click();
//                 cy.url().should("match", /\/destinations\/\d+$/);
//                 cy.get("h1").should("exist");
//             }
//         });
//     });
//
//     // --- LOGOUT ----------------------------------------------------------------
//     it("logs out successfully (if logged in)", () => {
//         cy.get("header").then(($hdr) => {
//             const $btns = $hdr.find("button");
//             const $logout = $btns.filter(
//                 (_, el) => el.textContent.trim() === "Logout"
//             );
//
//             if ($logout.length) {
//                 cy.wrap($logout.eq(0)).click();
//                 cy.url().should("include", "/");
//                 cy.get('header a[href="/login"]').first().should("be.visible");
//             } else {
//                 cy.get('header a[href="/login"]').first().should("be.visible");
//             }
//         });
//     });
//
//     // --- NEW TEST: TAGS ADMIN PAGE --------------------------------------------
//     it("allows admin to reach Tags admin page after login", () => {
//         nav().find('a[href="/login"]').first().click();
//
//         cy.get('input[type="email"]').clear().type("test@t.ca");
//         cy.get('input[type="password"]').clear().type("123456Pw");
//         cy.get('form button[type="submit"]').click();
//
//         cy.url().should("include", "/moderation");
//
//         nav().find('a[href="/tags"]').first().click();
//         cy.url().should("include", "/tags");
//
//         cy.get('input[placeholder^="Add new"]').should("exist");
//     });
// });


// cypress/e2e/travel_journal.cy.js

// Helper: target the top navbar only
const nav = () => cy.get("header").should("be.visible");

describe("Travel Journal – E2E (selectors only)", () => {
    beforeEach(() => {
        cy.visit("/");
        nav(); // ensure header is rendered before continuing
    });

    // --- NAV BAR ---------------------------------------------------------------
    it("shows navbar links on key pages", () => {
        // Public links on Home (not logged in)
        nav().find('a[href="/"]').first().should("be.visible");
        nav().find('a[href="/destinations"]').first().should("be.visible");
        nav().find('a[href="/add-destination"]').first().should("be.visible");
        nav().find('a[href="/journals"]').first().should("be.visible");

        // Either Login link or a Logout button should exist
        cy.get("body").then(($body) => {
            const hasLoginLink = $body.find('header a[href="/login"]').length > 0;
            const buttons = $body.find("header button");
            const hasLogoutButton =
                buttons.filter((_, el) => el.textContent.trim() === "Logout").length >
                0;

            expect(hasLoginLink || hasLogoutButton).to.be.true;
        });

        // go to Destinations
        nav().find('a[href="/destinations"]').first().click();
        cy.url().should("include", "/destinations");

        // go to Add Destination
        nav().find('a[href="/add-destination"]').first().click();
        cy.url().should("include", "/add-destination");

        // go to Login
        nav().find('a[href="/login"]').first().click();
        cy.url().should("include", "/login");
    });

    // --- ADD DESTINATION: VALIDATION ------------------------------------------
    describe("Add Destination validation", () => {
        beforeEach(() => {
            nav().find('a[href="/add-destination"]').first().click();
            cy.url().should("include", "/add-destination");
        });

        it("shows errors for empty form", () => {
            cy.get('form button[type="submit"], form button').last().click();

            cy.get("form").within(() => {
                cy.contains("Name is required").should("be.visible");
                cy.contains("Country is required").should("be.visible");
                cy.contains("City is required").should("be.visible");
                cy.contains("Visit date is required").should("be.visible");
                cy.contains("Choose 1–5").should("be.visible");
                cy.contains("Cover photo is required").should("be.visible");
            });
        });

        it("shows name error when others are filled", () => {
            cy.get("select").eq(0).select("Canada");
            cy.get("select").eq(1).select("Toronto");
            cy.get('input[type="date"]').type("2024-01-15");
            cy.get('input[type="radio"][value="4"]').check({ force: true });
            cy.get('input[type="file"]').selectFile(
                {
                    contents: Cypress.Buffer.from("test"),
                    fileName: "test.jpg",
                    mimeType: "image/jpeg",
                },
                { force: true }
            );
            cy.get('form button[type="submit"], form button').last().click();
            cy.contains("Name is required").should("be.visible");
        });

        it("shows cover error when missing", () => {
            cy.get('input[placeholder*="Canadian Museum"]').type("Test Place");
            cy.get("select").eq(0).select("Canada");
            cy.get("select").eq(1).select("Toronto");
            cy.get('input[type="date"]').type("2024-01-15");
            cy.get('input[type="radio"][value="3"]').check({ force: true });
            cy.get('form button[type="submit"], form button').last().click();
            cy.contains("Cover photo is required").should("be.visible");
        });
    });

    // --- ADD DESTINATION: HAPPY PATH ------------------------------------------
    it("submits a valid destination and shows success banner", () => {
        nav().find('a[href="/add-destination"]').first().click();

        cy.get('input[placeholder*="Canadian Museum"]').type("Cypress E2E Destination");
        cy.get("select").eq(0).select("Canada");
        cy.get("select").eq(1).select("Saskatoon");
        cy.get('input[type="date"]').type("2024-03-20");
        cy.get('input[type="radio"][value="5"]').check({ force: true });
        cy.get("textarea").type("Automated test destination.");
        cy.get('input[type="file"]').selectFile(
            {
                contents: Cypress.Buffer.from("fake image"),
                fileName: "e2e.jpg",
                mimeType: "image/jpeg",
            },
            { force: true }
        );

        cy.get('form button[type="submit"], form button').last().click();
        cy.get(".bg-green-100").should("be.visible");
    });

    // --- MODERATION: NOT LOGGED IN --------------------------------------------
    it("moderation shows admin-only message when not logged in", () => {
        cy.visit("/moderation");
        nav();
        cy.get("section .bg-red-100, section .text-slate-600")
            .first()
            .should("be.visible");
    });

    // --- AUTH & MODERATION -----------------------------------------------------
    it("logs in as admin and reaches moderation", () => {
        nav().find('a[href="/login"]').first().click();

        cy.get('input[type="email"]').clear().type("test@t.ca");
        cy.get('input[type="password"]').clear().type("123456Pw");

        cy.get('form button[type="submit"]').click();

        cy.url({ timeout: 10000 }).should("include", "/moderation");

        cy.get("header button").then(($btns) => {
            const exists = [...$btns].some(
                (b) => b.textContent.trim() === "Logout"
            );
            expect(exists).to.be.true;
        });
    });

    // --- DESTINATIONS: FILTERS -------------------------------------------------
    it("filters destinations by country and rating with Apply", () => {
        nav().find('a[href="/destinations"]').first().click();

        cy.get("form select").eq(0).select("Canada");
        cy.get("form select").eq(1).select("4");
        cy.get('form button[type="submit"], form button').first().click();

        cy.get("section .grid").should("exist");
    });

    // --- DESTINATION DETAILS ---------------------------------------------------
    it("opens first available destination details if any exist", () => {
        nav().find('a[href="/destinations"]').first().click();

        cy.get('a[href^="/destinations/"]').then(($links) => {
            if ($links.length > 0) {
                cy.wrap($links.eq(0)).click();
                cy.url().should("match", /\/destinations\/\d+$/);

                cy.get('h1, .inline-block.bg-\\[\\#0F766E\\]').should("exist");
            }
        });
    });

    // --- LOGOUT ----------------------------------------------------------------
    it("logs out successfully (if logged in)", () => {
        cy.get("header").then(($hdr) => {
            const $btns = $hdr.find("button");
            const $logout = $btns.filter(
                (_, el) => el.textContent.trim() === "Logout"
            );

            if ($logout.length) {
                cy.wrap($logout.eq(0)).click();
                cy.url().should("include", "/");
                cy.get('header a[href="/login"]').first().should("be.visible");
            } else {
                cy.get('header a[href="/login"]').first().should("be.visible");
            }
        });
    });

    // --- NEW TEST: TAGS ADMIN PAGE --------------------------------------------
    it("allows admin to reach Tags admin page after login", () => {
        nav().find('a[href="/login"]').first().click();

        cy.get('input[type="email"]').clear().type("test@t.ca");
        cy.get('input[type="password"]').clear().type("123456Pw");
        cy.get('form button[type="submit"]').click();

        cy.url().should("include", "/moderation");

        nav().find('a[href="/tags"]').first().click();
        cy.url().should("include", "/tags");

        cy.get('input[placeholder^="Add new"]').should("exist");
    });
});
