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
        this.data = {
            name: "character/vehicle name",
            maxMove: 0
        };
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
        const data = super.getData()
    
        data.name = "character/vehicle name"
        data.maxMove = 0
        data.maxAction = 0
        data.maxVel = 0
        //data = this.data;

        //data.name = this.data.name;
        //data.other = "Its me I'm other"
    
        return data
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('input').each((id, inp) => {
            this.changeValue = async function (e) {
              if (e.code === 'Enter' || e.code === 'Tab') {
                let key = e.target.dataset.key

                if (e.target.dataset.dtype === 'Number') {
                  this.data.name = e.target.value

                  if (isNaN(parseInt(e.target.value))) {
                    console.log(e.target.dataset.key)

                    this.data[`${key}`] = "bruh"

                    console.log(this.data)

                    //return
                  }
      
                  console.log(e.target.value)
                  //const changes = []
                  //changes[`system.characteristics.${e.target.name}`] = parseInt(e.target.value)
                  //await this.actor.update(changes)
                  
                } else {
                  //this._updateName(e.target.value)
                  console.log('else!')
                  console.log(e.target.value)
                }

                //this.getData()
                //this.render()
              }
            }

            inp.addEventListener('keydown', this.changeValue.bind(this))
        })
    }
}