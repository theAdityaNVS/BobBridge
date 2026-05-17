# Hackathon Submission: BobBridge

## Basic Information

### Submission Title
BobBridge: AI-Powered Mock API & Code Scaffold Generator

### Short Description
BobBridge transforms natural language prompts into live mock API endpoints and framework-specific code scaffolds using IBM watsonx.ai. Designed for rapid prototyping, it generates contracts and provides a seamless handoff to IBM Bob for implementation.

### Long Description
BobBridge is a high-performance developer tool built to bridge the gap between initial design intent and functional implementation. By leveraging IBM watsonx.ai (including Granite, Llama, and Mistral models), BobBridge allows developers to describe an API endpoint in plain English and instantly receive a live, testable mock URL, a robust JSON contract, and ready-to-use code scaffolds across 9 major programming languages and frameworks (including Java/Spring Boot, Python/FastAPI, TypeScript/NestJS, Go/Gin, Rust/Axum, C#/ASP.NET Core, PHP/Laravel, and Ruby on Rails).

The application features a sleek, IBM-branded interface utilizing the official IBM Blue color palette and design principles. Key features include a dynamic framework typing animation, an educational AI tips banner, smart auto-scrolling to results, and advanced input guardrails to ensure security by preventing the generation of sensitive content.

BobBridge is uniquely integrated with IBM Bob, a specialized VS Code fork. It provides a dedicated handoff section that generates implementation-ready prompts, enabling a seamless transition from API design to full-system development. Whether you're unblocking a front-end team or rapidly prototyping a new microservice, BobBridge accelerates the development lifecycle from concept to code. Built with Next.js 16 and Node.js 22, it represents the future of AI-driven development workflows.

### Categories
- Developer Tools
- Productivity
- Artificial Intelligence
- Web Development

### Technologies Used
- Next.js 16 (App Router, TypeScript)
- IBM watsonx.ai SDK
- IBM Granite, Llama 3.2/3.3, Mistral AI Models
- Tailwind CSS & shadcn/ui (IBM Blue Palette)
- Node.js 22
- Prism.js (Syntax Highlighting)
- jsonrepair
- nanoid
