Hooks.on("init", function() {
    VelocityTrackerList.initialize()
});

Hooks.on("getSceneControlButtons", (controls) => {
    controls[0].tools.push({
    name: 'velocity tracker',
    title: 'Velocity Tracker',
    icon: 'far fa-right',
    button: true,
    //onClick: () => new VelocityTracker().render(true),
    onClick: () => {
        const userId = game.userId;
        VelocityTrackerList.velocityTracker.render(true, {userId})
    },
    visible: true
    })
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(VelocityTrackerList.ID);
});

/**
 * A single VelocityTracker in a list of VelocityTrackers
 * @typedef {Object} VelocityTracker
 * @property {string} userId - the user's id which owns this VelocityTracker
 * @property {string} id - A unique ID to identify this VelocityTracker
 * @property {name} name - The name of the character/vehicle being tracked
 * @property {float} currentVelocity - current velocity of character/vehicle
 * @property {float} newVel - new velocity of character/vehicle
 * @property {float} movementAction - how far does a character/vehicle move in a specific turn
 * @property {float} acceleration - how much is character/vehicle accelerating?
 * @property {float} elapsedTime - total elapsed time since movment began
 * @property {string} actionTime - how long does this action take?
 * @property {string} maxVelocity - maximum velocity a Velocity Tracker can reach
 */
class VelocityTrackerList {
    static initialize() {
        this.velocityTracker = new VelocityTracker();

        // gm can see all velocity trackers
        game.settings.register(this.ID, this.SETTINGS.GM_CAN_SEE_ALL, {
            name: `VELOCITY-TRACKER.settings.${this.SETTINGS.GM_CAN_SEE_ALL}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `VELOCITY-TRACKER.settings.${this.SETTINGS.GM_CAN_SEE_ALL}.Hint`,
            onChange: () => ui.players.render()
        })

        // distance units setting
        game.settings.register(this.ID, this.SETTINGS.DISTANCE_UNITS, {
            name: `VELOCITY-TRACKER.settings.${this.SETTINGS.DISTANCE_UNITS}.Name`,
            default: "m/s",
            type: String,
            scope: 'world',
            config: true,
            hint: `VELOCITY-TRACKER.settings.${this.SETTINGS.DISTANCE_UNITS}.Hint`,
            onChange: () => ui.players.render()
        })

        // time units setting
        game.settings.register(this.ID, this.SETTINGS.TIME_UNITS, {
            name: `VELOCITY-TRACKER.settings.${this.SETTINGS.TIME_UNITS}.Name`,
            default: "m/s",
            type: String,
            scope: 'world',
            config: true,
            hint: `VELOCITY-TRACKER.settings.${this.SETTINGS.TIME_UNITS}.Hint`,
            onChange: () => ui.players.render()
        })

        // default action time
        game.settings.register(this.ID, this.SETTINGS.DEFAULT_ACTION_TIME, {
            name: `VELOCITY-TRACKER.settings.${this.SETTINGS.DEFAULT_ACTION_TIME}.Name`,
            default: 1,
            type: Number,
            scope: 'world',
            config: true,
            hint: `VELOCITY-TRACKER.settings.${this.SETTINGS.DEFAULT_ACTION_TIME}.Hint`,
            onChange: () => ui.players.render()
        })

        // default acceleration
        game.settings.register(this.ID, this.SETTINGS.DEFAULT_ACCELERATION, {
            name: `VELOCITY-TRACKER.settings.${this.SETTINGS.DEFAULT_ACCELERATION}.Name`,
            default: 0,
            type: Number,
            scope: 'world',
            config: true,
            hint: `VELOCITY-TRACKER.settings.${this.SETTINGS.DEFAULT_ACCELERATION}.Hint`,
            onChange: () => ui.players.render()
        })
    }

    static ID = 'velocity-tracker';

    static FLAGS = {
        VELOCITYTRACKER: 'velocitytracker'
    }

    static TEMPLATES = {
        VELOCITYTRACKERLIST: `./modules/${this.ID}/templates/velocity-tracker-list.hbs`
    }

    static SETTINGS = {
        DISTANCE_UNITS: 'distance-units',
        TIME_UNITS: 'time-units',
        DEFAULT_ACTION_TIME: 'default-action-time',
        DEFAULT_ACCELERATION: 'default-acceleration',
        GM_CAN_SEE_ALL: 'gm-can-see-all'
    }

    static log(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }
}

class VelocityTrackerData {
    // all velocity trackers for all users
    static get allVelocityTrackers() {
        const allVelocityTrackers = game.users.reduce((accumulator, user) => {
            const userVelocityTrackers = this.getVelocityTrackersForUser(user.id);

            return {
                ...accumulator,
                ...userVelocityTrackers
            }
        }, {});

        return allVelocityTrackers
    }

    static otherVelocityTrackers(userId) {
        const otherVelocityTrackers = game.users.reduce((accumulator, user) => {1
            if (user.id !== userId) {
                const userVelocityTrackers = this.getVelocityTrackersForUser(user.id);

                return {
                    ...accumulator,
                    ...userVelocityTrackers
                }
            }
        }, {});

        return otherVelocityTrackers
    }

    // get all velocity trackers for a given user
    static getVelocityTrackersForUser(userId) {
        return game.users.get(userId)?.getFlag(VelocityTrackerList.ID, VelocityTrackerList.FLAGS.VELOCITYTRACKER)
    }

    // create a new velocity tracker for a given user
    static createVelocityTracker(userId, velocityTrackerData) {
        const newVelocityTracker = {
            userId,
            id: foundry.utils.randomID(16),
            name: "",
            currentVelocity: 0,
            movementAction: 0,
            acceleration: game.settings.get(VelocityTrackerList.ID, VelocityTrackerList.SETTINGS.DEFAULT_ACCELERATION),
            elapsedTime: 0,
            actionTime: game.settings.get(VelocityTrackerList.ID, VelocityTrackerList.SETTINGS.DEFAULT_ACTION_TIME),
            maxVelocity: "",
            ...velocityTrackerData
        }

        const update = {
            [newVelocityTracker.id]: newVelocityTracker
        }

        return game.users.get(userId)?.setFlag(VelocityTrackerList.ID, VelocityTrackerList.FLAGS.VELOCITYTRACKER, update)
    }

    // update a specific velocity tracker by id with the provided updateData
    static updateVelocityTracker(velocityTrackerId, updateData) {
        const relevantVelocityTracker = this.allVelocityTrackers[velocityTrackerId];

        const update = {
            [velocityTrackerId]: updateData
        }

        return game.users.get(relevantVelocityTracker.userId)?.setFlag(VelocityTrackerList.ID, VelocityTrackerList.FLAGS.VELOCITYTRACKER, update);
    }

    static updateUserVelocityTrackers(userId, updateData) {
        return game.users.get(userId)?.setFlag(VelocityTrackerList.ID, VelocityTrackerList.FLAGS.VELOCITYTRACKER, updateData);
    }

    // delete a specific velocity tracker by id
    static deleteVelocityTracker(velocityTrackerId) {
        const relevantVelocityTracker = this.allVelocityTrackers[velocityTrackerId];

        const keyDeletion = {
            [`-=${velocityTrackerId}`]: null
        }

        return game.users.get(relevantVelocityTracker.userId)?.setFlag(VelocityTrackerList.ID, VelocityTrackerList.FLAGS.VELOCITYTRACKER, keyDeletion)
    }
}
class VelocityTracker extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            height: 'auto',
            width: 1000,
            id: 'velocity-tracker',
            template: VelocityTrackerList.TEMPLATES.VELOCITYTRACKERLIST,
            title: 'Velocity Tracker',
            userId: game.userId,
            closeOnSubmit: false, // do not close when submitted
            submitOnChange: true, // submit when any input changes
            resizable: true,
        }

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

        return mergedOptions
    }

    getData(options) {
        const otherVelocityTrackers = game.users.current?.isGM && game.settings.get(VelocityTrackerList.ID, VelocityTrackerList.SETTINGS.GM_CAN_SEE_ALL)
        ? VelocityTrackerData.otherVelocityTrackers(options.userId) : {}

        return {
            velocitytrackers: VelocityTrackerData.getVelocityTrackersForUser(options.userId),
            distanceUnits: game.settings.get(VelocityTrackerList.ID, VelocityTrackerList.SETTINGS.DISTANCE_UNITS),
            timeUnits: game.settings.get(VelocityTrackerList.ID, VelocityTrackerList.SETTINGS.TIME_UNITS),
            otherVelocityTrackers: otherVelocityTrackers
        }
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData);

        await VelocityTrackerData.updateUserVelocityTrackers(this.options.userId, expandedData);

        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;
        const velocityTrackerId = clickedElement.parents('[data-velocity-tracker-id]')?.data()?.velocityTrackerId;

        switch(action) {
            case 'create': {
                await VelocityTrackerData.createVelocityTracker(this.options.userId);
                this.render();
                break;
            }

            case 'delete': {
                const confirmed = await Dialog.confirm({
                    title: game.i18n.localize("VELOCITY-TRACKER.confirms.deleteConfirm.Title"),
                    content: game.i18n.localize("VELOCITY-TRACKER.confirms.deleteConfirm.Content")
                });

                if (confirmed) {
                    await VelocityTrackerData.deleteVelocityTracker(velocityTrackerId);
                    this.render();
                }

                break;
            }

            case 'progress': {
                const relevantVelocityTracker = VelocityTrackerData.allVelocityTrackers[velocityTrackerId];

                const actionTime = eval(relevantVelocityTracker.actionTime);

                const elapsedTime = relevantVelocityTracker.elapsedTime + actionTime;

                let newVelocity = Math.round((relevantVelocityTracker.movementAction / actionTime) + 
                    (relevantVelocityTracker.acceleration * elapsedTime**2));

                if (relevantVelocityTracker.maxVelocity !== null) newVelocity = Math.min(eval(relevantVelocityTracker.maxVelocity), newVelocity);

                const update = {
                    ["elapsedTime"]: elapsedTime,
                    ["currentVelocity"]: newVelocity
                };

                VelocityTrackerData.updateVelocityTracker(relevantVelocityTracker.id, update);

                this.render();
        
                break;
            }

            default:
                VelocityTrackerList.log(false, 'Invalid action detected', action)
        }
    }
}
