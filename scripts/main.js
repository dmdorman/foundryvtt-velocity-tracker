console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
    console.log("This code runs once the Foundry VTT software begins its initialization workflow.");

    Hooks.on("getSceneControlButtons", (controls) => {
        controls[0].tools.push({
        name: 'velocity tracker',
        title: 'Velocity Tracker',
        icon: 'far fa-up',
        button: true,
        onClick: () => new VelocityTracker().render(true),
        visible: true
        })
    });
});

Hooks.on("ready", function() {
    console.log("This code runs once core initialization is ready and game data is available.");
});
class VelocityTracker extends FormApplication {
    constructor() {
        super();
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['velocity-tracker-gui'],
            popOut: true,
            template: './modules/velocity-tracker/templates/tracker.hbs',
            id: 'velocity-tracker-application',
            title: 'Velocity Tracker',
        });
    }

    getData() {
        super.getData();
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}