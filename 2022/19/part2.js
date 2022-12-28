const fs = require('fs');

const FILE_NAME = process.argv[2] || 'input.txt';

const input = fs.readFileSync(FILE_NAME, 'utf8');

const blueprints = input.trimEnd().split('\n').map((line) => {
    const id = parseInt(line.split(' ')[1].replace(':', ''));
    const oreRobotOreCost = parseInt(line.split(' ')[6]);
    const clayRobotOreCost = parseInt(line.split(' ')[12]);
    const obsidianRobotOreCost = parseInt(line.split(' ')[18]);
    const obsidianRobotClayCost = parseInt(line.split(' ')[21]);
    const geodeRobotOreCost = parseInt(line.split(' ')[27]);
    const geodeRobotObsidianCost = parseInt(line.split(' ')[30]);

    return {
        id,
        oreRobotOreCost,
        clayRobotOreCost,
        obsidianRobotOreCost,
        obsidianRobotClayCost,
        geodeRobotOreCost,
        geodeRobotObsidianCost,
    }
});

const timeLimit = 32;
const queueByIdByTime = {};
const blueprintsById = {};
const maxGeodesByBlueprintId = {};
blueprints.forEach((blueprint, index) => {
    if (index > 2) {
        return;
    }

    maxGeodesByBlueprintId[blueprint.id] = 0;
    blueprintsById[blueprint.id] = blueprint;
})

const calculateStateScore = (state) => {
    return state.geodeRobotCount * 10000 + state.obsidianRobotCount * 1000 + state.clayRobotCount * 100 + state.oreRobotCount * 10 + state.geodeCount * 1000 + state.obsidianCount * 100 + state.clayCount * 10 + state.oreCount;
}

const step = (state) => {
    const updatedState = Object.assign({}, state);
    const id = updatedState.id;
    const time = updatedState.time;

    if (time === timeLimit) {
        if (maxGeodesByBlueprintId[id] < updatedState.geodeCount) {
            maxGeodesByBlueprintId[id] = updatedState.geodeCount;
        }

        return;
    }

    const canBuildOreRobot = updatedState.oreCount >= blueprintsById[id].oreRobotOreCost;
    const canBuildClayRobot = updatedState.oreCount >= blueprintsById[id].clayRobotOreCost;
    const canBuildObsidianRobot = updatedState.oreCount >= blueprintsById[id].obsidianRobotOreCost && updatedState.clayCount >= blueprintsById[id].obsidianRobotClayCost;
    const canBuildGeodeRobot = updatedState.oreCount >= blueprintsById[id].geodeRobotOreCost && updatedState.obsidianCount >= blueprintsById[id].geodeRobotObsidianCost;

    updatedState.oreCount += updatedState.oreRobotCount;
    updatedState.clayCount += updatedState.clayRobotCount;
    updatedState.obsidianCount += updatedState.obsidianRobotCount;
    updatedState.geodeCount += updatedState.geodeRobotCount;

    if (canBuildOreRobot) {
        const updatedUpdatedState = Object.assign({}, updatedState);
        updatedUpdatedState.oreRobotCount += 1;
        updatedUpdatedState.oreCount -= blueprintsById[id].oreRobotOreCost;
        updatedUpdatedState.time += 1;
        updatedUpdatedState.stateScore = calculateStateScore(updatedUpdatedState);
        queueByIdByTime[id][updatedUpdatedState.time].push(updatedUpdatedState);
    }

    if (canBuildClayRobot) {
        const updatedUpdatedState = Object.assign({}, updatedState);
        updatedUpdatedState.clayRobotCount += 1;
        updatedUpdatedState.oreCount -= blueprintsById[id].clayRobotOreCost;
        updatedUpdatedState.time += 1;
        updatedUpdatedState.stateScore = calculateStateScore(updatedUpdatedState);
        queueByIdByTime[id][updatedUpdatedState.time].push(updatedUpdatedState);
    }

    if (canBuildObsidianRobot) {
        const updatedUpdatedState = Object.assign({}, updatedState);
        updatedUpdatedState.obsidianRobotCount += 1;
        updatedUpdatedState.oreCount -= blueprintsById[id].obsidianRobotOreCost;
        updatedUpdatedState.clayCount -= blueprintsById[id].obsidianRobotClayCost;
        updatedUpdatedState.time += 1;
        updatedUpdatedState.stateScore = calculateStateScore(updatedUpdatedState);
        queueByIdByTime[id][updatedUpdatedState.time].push(updatedUpdatedState);
    }

    if (canBuildGeodeRobot) {
        const updatedUpdatedState = Object.assign({}, updatedState);
        updatedUpdatedState.geodeRobotCount += 1;
        updatedUpdatedState.oreCount -= blueprintsById[id].geodeRobotOreCost;
        updatedUpdatedState.obsidianCount -= blueprintsById[id].geodeRobotObsidianCost;
        updatedUpdatedState.time += 1;
        updatedUpdatedState.stateScore = calculateStateScore(updatedUpdatedState);
        queueByIdByTime[id][updatedUpdatedState.time].push(updatedUpdatedState);
    }

    const updatedUpdatedState = Object.assign({}, updatedState);
    updatedUpdatedState.time += 1;
    updatedUpdatedState.stateScore = calculateStateScore(updatedUpdatedState);
    queueByIdByTime[id][updatedUpdatedState.time].push(updatedUpdatedState);
}

blueprints.forEach((blueprint, index) => {
    if (index > 2) {
        return;
    }

    const state = {
        oreCount: 0,
        clayCount: 0,
        obsidianCount: 0,
        geodeCount: 0,
        oreRobotCount: 1,
        clayRobotCount: 0,
        obsidianRobotCount: 0,
        geodeRobotCount: 0,
        time: 0,
        stateScore: 0,
        id: blueprint.id,
    }

    queueByIdByTime[blueprint.id] = {};
    queueByIdByTime[blueprint.id][0] = [state];
    for (let i = 0; i <= timeLimit; i++) {
        if (!queueByIdByTime[blueprint.id][i]) {
            queueByIdByTime[blueprint.id][i] = [];
        }
    }

    let iterationCount = 0
    while (iterationCount < 20000) {
        for (let i = 0; i <= timeLimit; i++) {
            queueByIdByTime[blueprint.id][i].sort((a, b) => {
                return b.stateScore - a.stateScore;
            });

            iterationCount++;
            if (queueByIdByTime[blueprint.id][i].length > 0) {
                step(queueByIdByTime[blueprint.id][i].shift());
            }
        }
    }
});

console.log(Object.values(maxGeodesByBlueprintId).reduce((acc, val) => {
    return acc * val
}, 1));

