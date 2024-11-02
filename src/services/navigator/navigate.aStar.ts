import MinHeap from "@/utils/class/minheap";
import MapServices from "../maps/maps.services";
import { MapArray } from "../maps/maps.interface";

export function aStar(data: MapArray, start: [number, number], end: [number, number]): [number, number][] {

    const rows = data.row;
    const cols = data.column;

    // Heuristic function (Manhattan distance)
    function heuristic([x1, y1]: [number, number], [x2, y2]: [number, number]) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    const directions = [
        [0, -1], // left
        [-1, 0], // top
        [0, 1], // right
        [1, 0], // bottom
    ]

    // Priority queue for open set
    const openSet = new MinHeap();
    const gScores = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(Infinity));
    console.log("start:", start)
    console.log("gScores:", gScores)
    gScores[start[0]][start[1]] = 0;

    // Map to reconstruct the path
    const cameFrom: Map<string, [number, number]> = new Map();

    // Start with the initial node in the open set
    openSet.push({
        position: start,
        f: heuristic(start, end),
        g: 0
    });

    while (!openSet.isEmpty()) {
        const current = openSet.pop();
        const [x, y] = current.position;

        // If the end node is reached, reconstruct the path
        if (x === end[0] && y === end[1]) {
            return reconstructPath(cameFrom, end);
        }

        // Explore neighbors
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            // Check within grid bounds and if cell is walkable
            if (nx >= 0 && 
                nx < rows && 
                ny >= 0 && 
                ny < cols && 
                (data.data[MapServices.getIndex(nx, ny, data.column)] === 0 || 
                data.data[MapServices.getIndex(nx, ny, data.column)] === 4 ||
                data.data[MapServices.getIndex(nx, ny, data.column)] === 5
            )) {

                // console.log("=====> nx:", nx, "ny:", ny, "cols:", cols)
                // console.log('=====> data:', data.data[MapServices.getIndex(nx, ny, data.column)])
                const tentativeG = gScores[x][y] + 1;

                // console.log("---> tentativeG", tentativeG)
                // console.log(`---> gScore[${nx}][${ny}]: ${gScores[nx][ny]}`)
                if (tentativeG < gScores[nx][ny]) {
                    // Update g-score and push to priority queue
                    gScores[nx][ny] = tentativeG;
                    const f = tentativeG + heuristic([nx, ny], end);
                    openSet.push({ position: [nx, ny], f, g: tentativeG });
                    cameFrom.set(`${nx},${ny}`, [x, y]); // Track the path
                }
            }
        }
    }

    return []; // No path found

    // Helper to reconstruct the path from end to start
    function reconstructPath(cameFrom: Map<string, [number, number]>, current: [number, number]): [number, number][] {
        const path = [current];
        while (cameFrom.has(`${current[0]},${current[1]}`)) {
            current = cameFrom.get(`${current[0]},${current[1]}`)!;
            path.push(current);
        }
        return path.reverse(); // Return path from start to end
    }
}
