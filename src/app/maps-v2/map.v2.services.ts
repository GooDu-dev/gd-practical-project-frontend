import { RouteDescription } from "./map.v2.interface";

export function describeRoute(route: [number, number][]): RouteDescription[] {
    if (route.length < 2) return []; // At least 2 points are needed to describe a route

    // Clone the route array to avoid modifying the original
    const routeCopy = [...route];
    let prev = routeCopy.pop();
    let direction = "";
    let prev_direction = "";
    let count = 1; // Initialize count to 1 for the first move
    let output: RouteDescription[] = [];

    while (routeCopy.length > 0) {
        let cur = routeCopy.pop();

        // Determine the direction based on the axis of movement
        if (prev![0] !== cur![0]) {
            // Y-axis movement (up or down)
            direction = prev![0] < cur![0] ? "down" : "up";
        } else {
            // X-axis movement (left or right)
            direction = prev![1] < cur![1] ? "right" : "left";
        }

        // Check if the current direction matches the previous one
        if (direction === prev_direction) {
            count++; // Continue in the same direction
        } else {
            // Add the previous segment to output if there's a change in direction
            if (prev_direction) {
                output.push({
                    direction: prev_direction,
                    count: count,
                    position: { x: prev![1], y: prev![0] },
                });
            }
            count = 1; // Reset count for the new direction
        }

        // Update for the next iteration
        prev = cur;
        prev_direction = direction;
    }

    // Push the final segment after the loop ends
    if (prev_direction) {
        output.push({
            direction: prev_direction,
            count: count,
            position: { x: prev![1], y: prev![0] },
        });
    }

    return output;
}
