export function startEvo(canvas) {
    const ctx = canvas.getContext('2d');
    //canvas.style.border = "2px solid black";
    const rect = canvas.getBoundingClientRect();
    let worldWidth = rect.width;
    let worldHeight = rect.height;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
    let best_gen = 0;
    const startPoint = {
        x: worldWidth * 0.1,
        y: worldHeight * 0.9
    };
    const endPoint = {
        x: worldWidth * 0.9,
        y: worldHeight * 0.1
    };
    let best_score = Number.MAX_VALUE;
    const populationSize = 50;
    let population = [];
    const max_gens = 2001;
    let current_gen = 0;
    const best_gens = [];
    let isRunning = true;
    const pauseBtn = document.getElementById('pause-button');
    const pauseText = document.getElementById('pause-text');
    const iconPause = document.getElementById('icon-pause');
    const iconPlay = document.getElementById('icon-play');
    const regenBtn = document.getElementById('regen-button');
    function resetSimulation() {
        const wasFinished = (current_gen >= max_gens);
        current_gen = 0;
        best_gen = 0;
        best_score = Number.MAX_VALUE;
        best_gens.length = 0; 
        obstacles = genObstacles(worldWidth, worldHeight, startPoint, endPoint);
        population = [];
        for (let i = 0; i < populationSize; i++) {
            population.push({ path: createIndividual(startPoint, endPoint) });
        }
        const scoreDisplay = document.getElementById('score-display');
        const genDisplay = document.getElementById('gen-display');
        const bestGenDisplay = document.getElementById('gen-score-display');
        if (scoreDisplay) scoreDisplay.innerText = "0";
        if (genDisplay) genDisplay.innerText = "0";
        if (bestGenDisplay) bestGenDisplay.innerText = "0";
        if (!isRunning || wasFinished) {
            isRunning = true;
            const pauseText = document.getElementById('pause-text');
            const iconPause = document.getElementById('icon-pause');
            const iconPlay = document.getElementById('icon-play');
            
            if (pauseText) pauseText.innerText = "Pause";
            if (iconPlay) iconPlay.classList.add('hidden');
            if (iconPause) iconPause.classList.remove('hidden');
            
            lastTime = performance.now();
            requestAnimationFrame(evolve);
        }
    }
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt((dx * dx) + (dy * dy))
    }

    function randomGaussian(mean = 0, stdev = 1) {
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    }
    function getDistanceToSegment(px, py, x1, y1, x2, y2) {
        const lengthSquared = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (lengthSquared === 0) return getDistance(px, py, x1, y1);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lengthSquared;
        t = Math.max(0, Math.min(1, t));
        const closestX = x1 + t * (x2 - x1);
        const closestY = y1 + t * (y2 - y1);
        return getDistance(px, py, closestX, closestY);
    }

    function genTrack(worldWidth, worldHeight, startPoint, endPoint) {
        const trackPoints = [];
        trackPoints.push(startPoint);

        const numTurns = 5;
        for (let i = 1; i <= numTurns; i++) {
            let t = i / (numTurns + 1);
            let centerX = startPoint.x + t * (endPoint.x - startPoint.x);
            let centerY = startPoint.y + t * (endPoint.y - startPoint.y);

            let offset = (i % 2 === 0) ? 250 : -250;
            offset += getRandomInt(-50, 50);

            trackPoints.push({ x: centerX, y: centerY + offset });
        }

        trackPoints.push(endPoint);
        return trackPoints;
    }
    function genObstacles(worldWidth, worldHeight, startPoint, endPoint) {
        const obstacles = [];
        const numObstacles = getRandomInt(20, 25);
        const startEndSafeZoneRadius = 100;
        const trackSpread = 250;
        const minimumGap = 60;
        for (let i = 0; i < numObstacles; i++) {
            let x, y, radius;
            let isSafe = false;
            let attempts = 0;
            do {
                attempts++;
                let t = Math.random();
                let centerX = startPoint.x + t * (endPoint.x - startPoint.x);
                let centerY = startPoint.y + t * (endPoint.y - startPoint.y);
                x = Math.round(centerX + getRandomInt(-trackSpread, trackSpread));
                y = Math.round(centerY + getRandomInt(-trackSpread, trackSpread));
                radius = Math.round((Math.random() * 30) + 20);
                const distToStart = getDistance(x, y, startPoint.x, startPoint.y);
                const distToEnd = getDistance(x, y, endPoint.x, endPoint.y);
                if (distToStart > (startEndSafeZoneRadius + radius) && distToEnd > (startEndSafeZoneRadius + radius)) {
                    isSafe = true;
                    // for (let j = 0; j < obstacles.length; j++) {
                    //     const otherObs = obstacles[j];
                    //     const distBetweenCenters = getDistance(x, y, otherObs.x, otherObs.y);
                    //     const requiredDistance = radius + otherObs.radius + minimumGap;
                    //     if (distBetweenCenters < requiredDistance) {
                    //         isSafe = false;
                    //         break;
                    //     }
                    // }
                }
                // if (attempts > 100) {
                //     break;
                // }
            } while (!isSafe)

            obstacles.push({ x, y, radius });
        }
        return obstacles;
    }

    function createIndividual(startPoint, endPoint) {
        const path = [];
        path.push(startPoint);
        const max_points = 100;
        for (let i = 1; i < max_points - 1; i++) {
            let t = (i / max_points)
            let x = (startPoint.x + t * (endPoint.x - startPoint.x));// + getRandomInt(-0, 0);
            let y = (startPoint.y + t * (endPoint.y - startPoint.y)) + getRandomInt(-20, 20);
            path.push({ x, y });
        }
        path.push(endPoint);
        return path;
    }

    function evalFitness(individual, obstacles) {
        let totalDistance = 0;
        let totalPenalty = 0;
        const distanceWeight = 23;
        const inflate = 2;
        const path = individual.path;

        for (let i = 0; i < path.length - 1; i++) {
            const pt1 = path[i];
            const pt2 = path[i + 1];
            totalDistance += getDistance(pt1.x, pt1.y, pt2.x, pt2.y);

            for (let j = 0; j < obstacles.length; j++) {
                const obs = obstacles[j];
                const safeDistance = obs.radius + inflate;
                const distToSegment = getDistanceToSegment(obs.x, obs.y, pt1.x, pt1.y, pt2.x, pt2.y);
                if (distToSegment < safeDistance) {
                    const penaltyDegreeRatio = 1 - (distToSegment / safeDistance);
                    const specificPenalty = 100000 + (penaltyDegreeRatio * 400000);
                    totalPenalty += specificPenalty;
                }
            }
        }

        const distancePenalty = totalDistance * distanceWeight;
        individual.fitness = distancePenalty + totalPenalty;
        if (individual.fitness < best_score) {
            best_score = individual.fitness;
            best_gen = current_gen;
            best_gens.push(best_gen);
        }
    }
    // function evalFitness(individual, track) {
    //     let totalDistance = 0;
    //     let totalPenalty = 0;
    //     const distanceWeight = 15;
    //     const trackRadius = 65; 
    //     const path = individual.path;
    //     for (let i = 0; i < path.length - 1; i++) {
    //         const pt1 = path[i];
    //         const pt2 = path[i + 1];
    //         totalDistance += getDistance(pt1.x, pt1.y, pt2.x, pt2.y);
    //         let minDistanceToCenterline = Infinity;
    //         for (let j = 0; j < track.length - 1; j++) {
    //             const trackPt1 = track[j];
    //             const trackPt2 = track[j + 1];
    //             const dist = getDistanceToSegment(pt1.x, pt1.y, trackPt1.x, trackPt1.y, trackPt2.x, trackPt2.y);
    //             if (dist < minDistanceToCenterline) {
    //                 minDistanceToCenterline = dist;
    //             }
    //         }
    //         if (minDistanceToCenterline > trackRadius) {
    //             const offTrackAmount = minDistanceToCenterline - trackRadius;
    //             totalPenalty += 100000 + (offTrackAmount * 10000);
    //         }
    //     }

    //     individual.fitness = (totalDistance * distanceWeight) + totalPenalty;
    // }
    function selectParents(population) {
        const numParents = Math.floor(population.length * 0.13);
        population.sort(function (a, b) { return a.fitness - b.fitness })
        return population.slice(0, numParents);
    }

    // function mutate(parent) {
    //     const progress = current_gen / max_gens;
    //     const mutationSpread = 10 * (1 - progress) + 2;

    //     const originalPath = parent.path;
    //     const newPath = [];
    //     const middlePoints = [];

    //     for (let i = 1; i < originalPath.length - 1; i++) {
    //         const pt = originalPath[i];

    //         let mutatedX = pt.x + randomGaussian(0, Math.floor(mutationSpread));
    //         let mutatedY = pt.y + randomGaussian(0, Math.floor(mutationSpread));
    //         mutatedY = Math.max(0, Math.min(worldHeight, mutatedY));
    //         middlePoints.push({ x: mutatedX, y: mutatedY });
    //     }
    //     middlePoints.sort((a, b) => a.x - b.x);
    //     newPath.push({ x: originalPath[0].x, y: originalPath[0].y });
    //     newPath.push(...middlePoints);
    //     const lastIndex = originalPath.length - 1;
    //     newPath.push({ x: originalPath[lastIndex].x, y: originalPath[lastIndex].y });
    //     return { path: newPath };
    // }
    function mutate(parent) {
        const progress = current_gen / max_gens;
        let mutationSpread = 60 * (1 - progress) + 3; 
        let mutationRate = 0.40; 
        const originalPath = parent.path;
        const newPath = [];
        const middlePoints = [];
        const startX = originalPath[0].x;
        const endX = originalPath[originalPath.length - 1].x;
        if (parent.fitness >= 100000) {
            mutationSpread = 80; 
            mutationRate = 0.80; 
        }
        for (let i = 1; i < originalPath.length - 1; i++) {
            const pt = originalPath[i];

            let mutatedX = pt.x;
            let mutatedY = pt.y;
            if (Math.random() < mutationRate) {
                mutatedX += randomGaussian(0, Math.floor(mutationSpread * 0.4));
                //mutatedX = Math.max(startX, Math.min(endX, mutatedX));
                mutatedY += randomGaussian(0, Math.floor(mutationSpread));
                mutatedY = Math.max(0, Math.min(worldHeight, mutatedY));
            }
            
            middlePoints.push({ x: mutatedX, y: mutatedY });
        }
        
        middlePoints.sort((a, b) => a.x - b.x);

        const smoothingPasses = 2; 
        for (let pass = 0; pass < smoothingPasses; pass++) {
            for (let i = 1; i < middlePoints.length - 1; i++) {
                const prev = middlePoints[i - 1];
                const next = middlePoints[i + 1];
                const targetY = (prev.y + next.y) / 2;
                middlePoints[i].y = (middlePoints[i].y * 0.5) + (targetY * 0.5);
            }
        }

        newPath.push({ x: originalPath[0].x, y: originalPath[0].y });
        newPath.push(...middlePoints);
        const lastIndex = originalPath.length - 1;
        newPath.push({ x: originalPath[lastIndex].x, y: originalPath[lastIndex].y });
        
        return { path: newPath };
    }

    function drawCanvas(isFinished = false) {
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, worldWidth, worldHeight);
        ctx.fillStyle = "rgba(150, 150, 150, 0.2)";
        
        for (let i = 0; i < obstacles.length; i++) {
            const obs = obstacles[i];
            ctx.beginPath();
            ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        //ctx.stroke();
        // const trackWidth = 140; 

        // ctx.strokeStyle = "#e5e7eb"; // Tailwind gray-200 (The Asphalt)
        // ctx.lineJoin = "round"; // Automatically rounds the corners!
        // ctx.lineCap = "round";
        // ctx.lineWidth = trackWidth;

        // ctx.beginPath();
        // ctx.moveTo(track[0].x, track[0].y);
        // for (let i = 1; i < track.length; i++) {
        //     ctx.lineTo(track[i].x, track[i].y);
        // }
        function drawPath(path) {
            if (!path || path.length === 0) return;
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let j = 1; j < path.length; j++) {
                ctx.lineTo(path[j].x, path[j].y);
            }
            ctx.stroke();
        }

        if (isFinished) {
            ctx.strokeStyle = "rgba(150, 150, 150, 0.1)";
            ctx.lineWidth = 1;
            for (let i = 1; i < population.length; i++) {
                drawPath(population[i].path);
            }
            ctx.strokeStyle = "rgba(119, 14, 180, 1)";
            ctx.lineWidth = 2;
            drawPath(population[0].path);

        } else {
            ctx.strokeStyle = "rgba(119, 14, 180, 0.15)";
            ctx.lineWidth = 2;
            for (let i = 0; i < population.length; i++) {
                drawPath(population[i].path);
            }
        }
    }

    let obstacles = genObstacles(worldWidth, worldHeight, startPoint, endPoint);
    //const track = genTrack(worldWidth, worldHeight, startPoint, endPoint);
    for (let i = 0; i < populationSize; i++) {
        const newPath = createIndividual(startPoint, endPoint);
        population.push({ path: newPath });
    }
    let lastTime = 0;
    const targetFPS =45;
    const frameInterval = 1000 / targetFPS;

    function evolve(timestamp) {
        if (!isRunning) return;
        const deltaTime = timestamp - lastTime;
        if (deltaTime >= frameInterval) {
            lastTime = timestamp - (deltaTime % frameInterval);

            for (let i = 0; i < population.length; i++) {
                evalFitness(population[i], obstacles);
            }

            population.sort(function (a, b) { return a.fitness - b.fitness });
            const scoreDisplay = document.getElementById('score-display');
            const genDisplay = document.getElementById('gen-display');
            const straightLineScoreDisplay = document.getElementById('straight-display')
            const bestGenDisplay = document.getElementById('gen-score-display')
            if (scoreDisplay && genDisplay && straightLineScoreDisplay && bestGenDisplay) {
                scoreDisplay.innerText = Math.round(population[0].fitness).toLocaleString();
                genDisplay.innerText = current_gen;
                straightLineScoreDisplay.innerText = Math.round(getDistance(startPoint.x, startPoint.y, endPoint.x, endPoint.y) * 23).toLocaleString();
                bestGenDisplay.innerText = best_gen;
            }
            current_gen++;
            if (current_gen >= max_gens) {
                drawCanvas(true);
                return;
            }

            //const numParents = Math.floor(populationSize * 0.2);
            const parents = selectParents(population)
            const nextGeneration = [];
            nextGeneration.push(parents[0]);
            for (let i = 0; i < populationSize - 1; i++) {
                const randomParentIndex = Math.floor(Math.random() * parents.length);
                const child = mutate(parents[randomParentIndex]);
                nextGeneration.push(child);
            }

            population = nextGeneration;
            drawCanvas(false);
        }
        
        requestAnimationFrame(evolve);
    }
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isRunning = !isRunning; // Flip the state (true -> false, or false -> true)

            if (isRunning) {
                pauseText.innerText = "Pause";
                iconPlay.classList.add('hidden');
                iconPause.classList.remove('hidden');
                
                lastTime = performance.now(); 
                requestAnimationFrame(evolve); 
            } else {
                pauseText.innerText = "Play";
                iconPause.classList.add('hidden');
                iconPlay.classList.remove('hidden');
            }
        });
    }
    

    if (regenBtn) {
        regenBtn.addEventListener('click', resetSimulation);
    }
    //console.log(best_gens);
    requestAnimationFrame(evolve);
}