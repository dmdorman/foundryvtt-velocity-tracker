console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
    console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
});

Hooks.on("ready", function() {
    console.log("This code runs once core initialization is ready and game data is available.");

    async function createPopOut() {
        //const content = await _renderForm();
        const templateData = {};

        var path = "modules/velocity-tracker/templates/tracker.hbs";
        1
        const content = await renderTemplate(path, templateData);

        // Attack Card as a Pop Out
        let options = {
            'width' : 300,
        }

        //return new Promise(resolve => {
            const data = {
                title: "Velocity Tracker",
                content: content,
                buttons: {},
                default: "none",
                //close: () => resolve({})
            }

            new Dialog(data, options).render(true);;
        //});
    }

    createPopOut()
});