export const ANARCHY = {
    settings: {
        defaultCssClass: {
            name: 'ANARCHY.settings.defaultCssClass.name',
            hint: 'ANARCHY.settings.defaultCssClass.hint'
        },
        gmDifficulty: {
            name: 'ANARCHY.settings.gmDifficulty.name',
            hint: 'ANARCHY.settings.gmDifficulty.hint',
            default: 'ANARCHY.settings.gmDifficulty.default',
            chatMessage: 'ANARCHY.settings.gmDifficulty.chatMessage',
        }
    },
    gmManager: {
        title: 'ANARCHY.gmManager.title',
        playerChangedAnarchy: 'ANARCHY.gmManager.playerChangedAnarchy',
        gmReceivedAnarchy: 'ANARCHY.gmManager.gmReceivedAnarchy',
    },
    chat: {
        blindMessageToGM: 'ANARCHY.chat.blindMessageToGM'
    },
    common: {
        newEntry: 'ANARCHY.common.newEntry',
        newName: 'ANARCHY.common.newName',
        cancel: 'ANARCHY.common.cancel',
        add: 'ANARCHY.common.add',
        edit: 'ANARCHY.common.edit',
        del: 'ANARCHY.common.del',
        attach: 'ANARCHY.common.attach',
        attachCopy: 'ANARCHY.common.attachCopy',
        roll: {
            button: 'ANARCHY.common.roll.button',
            title: 'ANARCHY.common.roll.title',
            attribute: 'ANARCHY.common.roll.attribute',
            attribute2: 'ANARCHY.common.roll.attribute2',
            modifiers: {
                edge: 'ANARCHY.common.roll.modifiers.edge',
                specialization: 'ANARCHY.common.roll.modifiers.specialization',
                anarchyDisposition: 'ANARCHY.common.roll.modifiers.anarchyDisposition',
                anarchyRisk: 'ANARCHY.common.roll.modifiers.anarchyRisk',
                wounds: 'ANARCHY.common.roll.modifiers.wounds',
                range: 'ANARCHY.common.roll.modifiers.range',
                other: 'ANARCHY.common.roll.modifiers.other',
                reroll: 'ANARCHY.common.roll.modifiers.reroll',
                rerollForced: 'ANARCHY.common.roll.modifiers.rerollForced',
                opponentRerollForced: 'ANARCHY.common.roll.modifiers.opponentRerollForced',
                opponentReduce: 'ANARCHY.common.roll.modifiers.opponentReduce'
            },
            totalSuccess: 'ANARCHY.common.roll.totalSuccess',
            success: 'ANARCHY.common.roll.success',
            risk: {
                prowess: 'ANARCHY.common.roll.risk.prowess',
                nothing: 'ANARCHY.common.roll.risk.nothing',
                glitch: 'ANARCHY.common.roll.risk.glitch',
            },
            rerollSuccess: 'ANARCHY.common.roll.rerollSuccess',
            rerollForcedLoss: 'ANARCHY.common.roll.rerollForcedLoss',
            rerollForcedSuccess: 'ANARCHY.common.roll.rerollForcedSuccess',
        },
        confirmation: {
            del: 'ANARCHY.common.confirmation.del',
            delItem: 'ANARCHY.common.confirmation.delItem',
            delOwner: 'ANARCHY.common.confirmation.delOwner',
            attach: 'ANARCHY.common.confirmation.attach',
            attachOrCopy: 'ANARCHY.common.confirmation.attachOrCopy',
        },
        errors: {
            insufficient: 'ANARCHY.common.errors.insufficient',
            outOfRange: 'ANARCHY.common.errors.outOfRange',
            onlyGM: 'ANARCHY.common.errors.onlyGM',
            expectedType: 'ANARCHY.common.errors.expectedType',
        },
        sourceReference: 'ANARCHY.common.sourceReference',
        sourceReferenceHelp: 'ANARCHY.common.sourceReferenceHelp',
        description: 'ANARCHY.common.description',
        gmnotes: 'ANARCHY.common.gmnotes',
        anarchy: {
            anarchy: 'ANARCHY.common.anarchy.anarchy',
            sceneAnarchy: 'ANARCHY.common.anarchy.sceneAnarchy',
            danger: 'ANARCHY.common.anarchy.danger',
        },
    },
    actor: {
        characterSheet: 'ANARCHY.actor.characterSheet',
        npcSheet: 'ANARCHY.actor.npcSheet',
        actorName: 'ANARCHY.actor.actorName',
        genre: 'ANARCHY.actor.genre',
        noMetatype: 'ANARCHY.actor.noMetatype',
        singular: {
            keyword: 'ANARCHY.actor.singular.keyword',
            disposition: 'ANARCHY.actor.singular.disposition',
            cue: 'ANARCHY.actor.singular.cue',
        },
        plural: {
            keyword: 'ANARCHY.actor.plural.keyword',
            disposition: 'ANARCHY.actor.plural.disposition',
            cue: 'ANARCHY.actor.plural.cue',
        },
        essence: {
            adjustments: 'ANARCHY.actor.essence.adjustments',
            adjustShort: 'ANARCHY.actor.essence.adjustShort',
        },
        counters: {
            essence: 'ANARCHY.actor.counters.essence',
            karma: 'ANARCHY.actor.counters.karma',
            karmaTotal: 'ANARCHY.actor.counters.karmaTotal',
            edge: 'ANARCHY.actor.counters.edge',
        },
        monitors: {
            conditionMonitors: 'ANARCHY.actor.monitors.conditionMonitors',
            physical: 'ANARCHY.actor.monitors.physical',
            stun: 'ANARCHY.actor.monitors.stun',
            matrix: 'ANARCHY.actor.monitors.matrix',
            armor: 'ANARCHY.actor.monitors.armor',
            structure: 'ANARCHY.actor.monitors.structure',
            resistance: 'ANARCHY.actor.monitors.resistance',
        },
        vehicle: {
            handling: 'ANARCHY.actor.vehicle.handling',
            moves: 'ANARCHY.actor.vehicle.moves',
            attacks: 'ANARCHY.actor.vehicle.attacks',
            stealth: 'ANARCHY.actor.vehicle.stealth',
            category: 'ANARCHY.actor.vehicle.category',
            skill: 'ANARCHY.actor.vehicle.skill'
        },
        ownership: {
            owner: 'ANARCHY.actor.ownership.owner',
            unknown: 'ANARCHY.actor.ownership.unknown',
        }
    },
    actorType: {
        singular: {
            character: 'ANARCHY.actorType.singular.character',
            vehicle: 'ANARCHY.actorType.singular.vehicle',
            device: 'ANARCHY.actorType.singular.device',
        },
        plural: {
            character: 'ANARCHY.actorType.singular.character',
            vehicle: 'ANARCHY.actorType.singular.vehicle',
            device: 'ANARCHY.actorType.singular.device',
        }
    },
    item: {
        sheet: 'ANARCHY.item.sheet',
        common: {
            inactive: 'ANARCHY.item.common.inactive',
        },
        skill: {
            code: 'ANARCHY.item.skill.code',
            copyDefault: 'ANARCHY.item.skill.useDefault',
            isKnowledge: 'ANARCHY.item.skill.isKnowledge',
            attribute: 'ANARCHY.item.skill.attribute',
            value: 'ANARCHY.item.skill.value',
            specialization: 'ANARCHY.item.skill.specialization',
            specializationHelp: 'ANARCHY.item.skill.specializationHelp'
        },
        quality: {
            positive: 'ANARCHY.item.quality.positive'
        },
        shadowamp: {
            category: 'ANARCHY.item.shadowamp.category',
            capacity: 'ANARCHY.item.shadowamp.capacity',
            level: 'ANARCHY.item.shadowamp.level',
            essence: 'ANARCHY.item.shadowamp.essence',
            levelShort: 'ANARCHY.item.shadowamp.levelShort',
            essenceShort: 'ANARCHY.item.shadowamp.essenceShort'
        },
        weapon: {
            skill: 'ANARCHY.item.weapon.skill',
            damage: 'ANARCHY.item.weapon.damage',
            strength: 'ANARCHY.item.weapon.strength',
            area: 'ANARCHY.item.weapon.area',
            noArmor: 'ANARCHY.item.weapon.noArmor',
            withArmor: 'ANARCHY.item.weapon.withArmor',
            damageShort: 'ANARCHY.item.weapon.damageShort',
            areaShort: 'ANARCHY.item.weapon.areaShort',
            noArmorShort: 'ANARCHY.item.weapon.noArmorShort',
            meleeWithoutActor: 'ANARCHY.item.weapon.meleeWithoutActor',
            range: {
                max: 'ANARCHY.item.weapon.range.max'
            }
        }
    },
    itemType: {
        singular: {
            metatype: 'ANARCHY.itemType.singular.metatype',
            skill: 'ANARCHY.itemType.singular.skill',
            quality: 'ANARCHY.itemType.singular.quality',
            shadowamp: 'ANARCHY.itemType.singular.shadowamp',
            weapon: 'ANARCHY.itemType.singular.weapon',
            gear: 'ANARCHY.itemType.singular.gear',
            contact: 'ANARCHY.itemType.singular.contact'
        },
        plural: {
            metatype: 'ANARCHY.itemType.plural.metatype',
            skill: 'ANARCHY.itemType.plural.skill',
            quality: 'ANARCHY.itemType.plural.quality',
            shadowamp: 'ANARCHY.itemType.plural.shadowamp',
            weapon: 'ANARCHY.itemType.plural.weapon',
            gear: 'ANARCHY.itemType.plural.gear',
            contact: 'ANARCHY.itemType.plural.contact'
        }
    },
    capacity: {
        mundane: 'ANARCHY.capacity.mundane',
        awakened: 'ANARCHY.capacity.awakened',
        emerged: 'ANARCHY.capacity.emerged'
    },
    monitor: {
        physical: 'ANARCHY.monitor.physical',
        stun: 'ANARCHY.monitor.stun',
        matrix: 'ANARCHY.monitor.matrix',
    },
    monitorLetter: {
        physical: 'ANARCHY.monitorLetter.physical',
        stun: 'ANARCHY.monitorLetter.stun',
        matrix: 'ANARCHY.monitorLetter.matrix'
    },
    shadowampCategory: {
        adeptPower: 'ANARCHY.shadowampCategory.adeptPower',
        bioware: 'ANARCHY.shadowampCategory.bioware',
        complexForm: 'ANARCHY.shadowampCategory.complexForm',
        cyberdeck: 'ANARCHY.shadowampCategory.cyberdeck',
        cyberware: 'ANARCHY.shadowampCategory.cyberware',
        drone: 'ANARCHY.shadowampCategory.drone',
        equipment: 'ANARCHY.shadowampCategory.equipment',
        focus: 'ANARCHY.shadowampCategory.focus',
        program: 'ANARCHY.shadowampCategory.program',
        spell: 'ANARCHY.shadowampCategory.spell',
        special: 'ANARCHY.shadowampCategory.special'
    },
    attributes: {
        strength: 'ANARCHY.attributes.strength',
        agility: 'ANARCHY.attributes.agility',
        willpower: 'ANARCHY.attributes.willpower',
        logic: 'ANARCHY.attributes.logic',
        charisma: 'ANARCHY.attributes.charisma',
        edge: 'ANARCHY.attributes.edge',
        knowledge: 'ANARCHY.attributes.knowledge',
        noAttribute: 'ANARCHY.attributes.noAttributes',
        autopilot: 'ANARCHY.attributes.autopilot',
        firewall: 'ANARCHY.attributes.firewall',
        system: 'ANARCHY.attributes.system',
    },
    attributeActions: {
        catch: 'ANARCHY.attributeActions.catch',
        defense: 'ANARCHY.attributeActions.defense',
        judgeIntentions: 'ANARCHY.attributeActions.judgeIntentions',
        perception: 'ANARCHY.attributeActions.perception',
        resistTorture: 'ANARCHY.attributeActions.resistTorture',
        composure: 'ANARCHY.attributeActions.composure',
        memory: 'ANARCHY.attributeActions.memory',
        lift: 'ANARCHY.attributeActions.lift',
    },
    skill: {
        athletics: 'ANARCHY.skill.athletics',
        closeCombat: 'ANARCHY.skill.closeCombat',
        projectileWeapons: 'ANARCHY.skill.projectileWeapons',
        firearms: 'ANARCHY.skill.firearms',
        heavyWeapons: 'ANARCHY.skill.heavyWeapons',
        vehicleWeapons: 'ANARCHY.skill.vehicleWeapons',
        stealth: 'ANARCHY.skill.stealth',
        pilotingGround: 'ANARCHY.skill.pilotingGround',
        pilotingOther: 'ANARCHY.skill.pilotingOther',
        escapeArtist: 'ANARCHY.skill.escapeArtist',
        astralCombat: 'ANARCHY.skill.astralCombat',
        conjuring: 'ANARCHY.skill.conjuring',
        sorcery: 'ANARCHY.skill.sorcery',
        survival: 'ANARCHY.skill.survival',
        biotech: 'ANARCHY.skill.biotech',
        electronics: 'ANARCHY.skill.electronics',
        hacking: 'ANARCHY.skill.hacking',
        engineering: 'ANARCHY.skill.engineering',
        tracking: 'ANARCHY.skill.tracking',
        tasking: 'ANARCHY.skill.tasking',
        con: 'ANARCHY.skill.con',
        intimidation: 'ANARCHY.skill.intimidation',
        negotiation: 'ANARCHY.skill.negotiation',
        disguise: 'ANARCHY.skill.disguise',
        animals: 'ANARCHY.skill.animals',
        etiquette: 'ANARCHY.skill.etiquette',
    },
    area: {
        none: 'ANARCHY.area.none',
        shotgun: 'ANARCHY.area.shotgun',
        circle: 'CONTROLS.MeasureCircle',
        cone: 'CONTROLS.MeasureCone',
        rect: 'CONTROLS.MeasureRect',
        ray: 'CONTROLS.MeasureRay'
    },
    range: {
        short: 'ANARCHY.range.short',
        medium: 'ANARCHY.range.medium',
        long: 'ANARCHY.range.long',
    },
    vehicleCategory: {
        miniDrone: 'ANARCHY.vehicleCategory.miniDrone',
        smallDrone: 'ANARCHY.vehicleCategory.smallDrone',
        mediumDrone: 'ANARCHY.vehicleCategory.mediumDrone',
        largeDrone: 'ANARCHY.vehicleCategory.largeDrone',
        motorcycle: 'ANARCHY.vehicleCategory.motorcycle',
        smallCar: 'ANARCHY.vehicleCategory.smallCar',
        largeCar: 'ANARCHY.vehicleCategory.largeCar',
        van: 'ANARCHY.vehicleCategory.van',
        truck: 'ANARCHY.vehicleCategory.truck',
        aircraft: 'ANARCHY.vehicleCategory.aircraft',
        boat: 'ANARCHY.vehicleCategory.boat',
    }
};

