# Demo 🎬

Below you can find a demo of this project. Currently, I am rendering the map in the browser using react-three-fiber, adding physics (gravity and collisions) with the react-three/rapier library, and including a player. (I'm just learning Blender, and my skills aren't yet sufficient to create characters in Blender, so I found one on the internet. I promise to improve this in future projects. 😉)

https://github.com/user-attachments/assets/2604af72-ba25-4852-ae18-ab77c54489a0


# Technologies ⚙️

- React
- react-three/fiber
- react-three/drei
- react-three/rapier
- blender


# About ℹ️

Welcome to version 2 of the project! Here’s a quick rundown of what's new compared to v1.

## Cool Things About This Project

- **3D City Map in Blender:**  
  The biggest change in v2 is the updated map. Check out the video below to see the side-by-side comparison. The new map has better textures, bug fixes, and a flatter design. Plus, I've added a bunch of new elements to make the game experience even more fun.

https://github.com/user-attachments/assets/eceee033-2b9f-430b-90ad-b7b0abf5dd13


- In the second version, I added shooting functionality and bots with custom logic. Instead of using a library, I decided to create my own bot behavior for a bit of fun. The bots operate in two states:
  1. **Wandering:** They randomly change direction every few seconds.
  2. **Chasing:** When a bot detects the player (by measuring the distance), it starts chasing and shooting.

- I also built a small helper map that tracks the character's position on the main map and displays it in real time on a mini version.

https://github.com/user-attachments/assets/7f5f4106-199f-4df7-942c-5554f748202d


- Here, I'll show you the process of making some of the buildings and objects. I won't include videos for every single object since GitHub has size limits and those videos can get pretty large.

https://github.com/user-attachments/assets/d2aa4ede-f71b-424f-a8e7-cb715c0325f0

https://github.com/user-attachments/assets/6265000a-7420-469a-8055-dc3b81103f08


# Future plans 🚀

## If you like this repo, please give it a star. I’d also love to hear your feedback and ideas on how to improve the game.

Here are a few things I have in mind for future updates:

- **Camera Improvements:**  
  I’d like to change the camera so that both the camera and the player face the same direction (like in the Coastal World game). This should boost user experience and open up opportunities for adding more objects to the map. Right now, if the player is behind an object, it's hard to see them.

- **Enhanced Bot Logic:**  
  I plan to refine the bots and their custom AI to make their behavior even more engaging.










