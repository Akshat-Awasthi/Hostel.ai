import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Sketch = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            let faceY; // Initial y-coordinate of the face
            const faceX = 50; // Fixed x-coordinate of the face (middle of the small canvas)
            const faceRadius = 15; // Radius of the face to make it bigger
            const faceSpeed = 0.7; // Speed of the face
            let faceDirection = 1; // Direction of face movement (1 for down, -1 for up)
            let isHappy = true; // State of the face (true for happy, false for sad)

            p.setup = () => {
                p.createCanvas(100, 70); // Change canvas to a vertical layout
                faceY = p.height / 2; // Start face at the middle of the canvas
            };

            p.draw = () => {
                // Set the background color to white
                p.background(255);

                // Update the position of the face
                faceY += faceSpeed * faceDirection;

                // Check if the face hits the top or bottom boundary of the canvas
                if (faceY - faceRadius <= 0 || faceY + faceRadius >= p.height) {
                    // Reverse the direction of movement
                    faceDirection *= -1;
                    // Toggle the happiness state of the face
                    isHappy = !isHappy;
                }

                // Draw the face at the current position and state
                drawFace(p, faceX, faceY, faceRadius, isHappy);
            };

            // Function to draw a face (smiley or sad)
            const drawFace = (p, x, y, radius, happy) => {
                // Set the fill color based on the happiness state
                if (happy) {
                    p.fill(76, 175, 80); // Happy face: set color to green
                } else {
                    p.fill(234, 67, 53); // Sad face: set color to red
                }

                // Draw the face (circle)
                p.ellipse(x, y, radius * 2, radius * 2);

                // Draw the eyes
                p.fill(0);
                p.ellipse(x - radius / 3, y - radius / 6, radius / 6, radius / 6); // Left eye
                p.ellipse(x + radius / 3, y - radius / 6, radius / 6, radius / 6); // Right eye

                // Draw the mouth
                p.noFill();
                p.stroke(0);
                if (happy) {
                    // Smiley mouth (arc from 0 to PI)
                    p.arc(x, y + radius / 4, radius / 2, radius / 2, 0, p.PI);
                } else {
                    // Sad mouth (arc from PI to 2 * PI)
                    p.arc(x, y + radius / 4, radius / 2, radius / 2, p.PI, 2 * p.PI);
                }
            };
        };

        // Create a new p5 instance with the sketch function
        const p5Instance = new p5(sketch, canvasRef.current);

        // Clean up the p5 instance when the component unmounts
        return () => {
            p5Instance.remove();
        };
    }, []);

    // Return the canvas element for the p5.js sketch
    return <div ref={canvasRef}></div>;
};

export default P5Sketch;
