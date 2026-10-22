# 3D scenes

Real 3D models (Three.js) rendered with soft shadows and glossy materials in the Alpha Nodus colors.
`scenes.js` holds the scenes, `engine.js` the lighting and camera, `render.js` renders them to transparent PNGs (see `renders/`).
To re-render: `npm i three@0.160.0`, serve this folder (`npx http-server`), then `node render.js phone fax network`.
