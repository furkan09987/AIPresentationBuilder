"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";
import premium from "@/assets/premium.png";
import { ContentItem, ContentType, Slide } from "@/lib/types";
import { json } from "stream/consumers";

export const generateCreativePrompt = async (userPrompt: string) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const finalPrompt = `
Create a coherent and relevant outline for the following prompt: ${userPrompt}.
The outline should consist of at least 6 points, with each point written as a single sentence.
Ensure the outline is well-structured and directly related to the topic.
Return the output in the following JSON format:
{
  "outlines": [
    "Point 1",
    "Point 2",
    "Point 3",
    "Point 4",
    "Point 5",
    "Point 6"
  ]
}
Ensure that the JSON is valid and properly formatted. Do not include any other text or explanations outside the JSON.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content: "YOU ARE A HELPFUL AI THAT GENERATES OUTLINES FOR PRESENTATIONS.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.0,
    });

    const responseContent = completion.choices[0].message?.content;
    if (responseContent) {
      try {
        const jsonResponse = JSON.parse(responseContent.replace(/```json|```/g, ""));
        return { status: 200, data: jsonResponse };
      } catch (error) {
        console.error("Geçersiz JSON alındı:", responseContent, error);
        return { status: 500, error: "AI' dan geçersiz JSON formatı alındı" };
      }
    }

    return { status: 400, error: "İçerik oluşturulmadı" };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

const existingLayouts = [
  {
    id: uuidv4(),
    slideName: "Blank card",
    type: "blank-card",
    className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent left",
    type: "accentLeft",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      restrictDropTo: true,
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              content: "src/assets/premium.png",
              alt: "Title",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent Right",
    type: "accentRight",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              restrictToDrop: true,
              content: "src/assets/premium.png",
              alt: "Title",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Image and text",
    type: "imageAndText",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Image and text",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content: "src/assets/premium.png",
                  alt: "Title",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Text and image",
    type: "textAndImage",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content: "src/assets/premium.png",
                  alt: "Title",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns",
    type: "twoColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns with headings",
    type: "twoColumnsWithHeadings",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Three column",
    type: "threeColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },
];

const generateImageUrl = async (prompt: string): Promise<string> => {
  try {
    const improvedPrompt = `
Create a highly realistic, professional image based on the
following description. The image should look as if captured in
real life, with attention to detail, lighting, and texture.

Description: ${prompt}

Important Notes:
- The image must be in a photorealistic style and visually
compelling.
- Ensure all text, signs, or visible writing in the image are in
English.
- Pay special attention to lighting, shadows, and textures to make
the image as lifelike as possible.
- Avoid elements that appear abstract, cartoonish, or overly
artistic. The image should be suitable for professional
presentations.
- Focus on accurately depicting the concept described, including
specific objects, environment, mood, and context. Maintain
relevance to the description provided.

Example Use Cases: Business presentations, educational slides,
professional designs.
`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const dalleResponse = await openai.images.generate({
      prompt: improvedPrompt,
      n: 1,
      size: "1024x1024",
    });
    /* if (useLocalImage) {
      const fs = require("fs");
      const imageData = fs.readFileSync("/path/to/your/local/image.jpg").toString("base64");
      return `data:image/jpeg;base64,${imageData}`;
    } */
    if (dalleResponse.data) {
      console.log("✔ Resim başarıyla oluşturuldu:", dalleResponse.data[0]?.url);
      return dalleResponse.data[0]?.url || "https://via.placeholder.com/1024";
    } else {
      throw new Error("Resim oluşturulamadı. dalleResponse data verisi içermiyor.");
    }
  } catch (error) {
    console.error("Resim oluşturulamadı:", error);
    return "https://via.placeholder.com/1024";
  }
};

const findImageComponents = (layout: ContentItem): ContentItem[] => {
  const images = [];
  if (layout.type === "image") {
    images.push(layout);
  }
  if (Array.isArray(layout.content)) {
    layout.content.forEach((child) => {
      images.push(...findImageComponents(child as ContentItem));
    });
  } else if (layout.content && typeof layout.content === "object") {
    images.push(...findImageComponents(layout.content));
  }
  return images;
};

const replaceImagePlaceholders = async (layout: Slide) => {
  const imageComponents = findImageComponents(layout.content);
  console.log("🟢 Found image components:", imageComponents);
  for (const component of imageComponents) {
    console.log("🟢 Generating image for component:", component.alt);
    component.content = await generateImageUrl(component.alt || "Placeholder Image");
  }
};

export const generateLayoutsJson = async (outlineArray: string[]) => {
  const prompt = `### Guidelines
You are a highly creative AI that generates JSON-based layouts for presentations. I willprovide you with a pattern and a format to follow,
and for each outline, you must generate unique
layouts and contents and give me the output in the
JSON format expected.
Our final JSON output is a combination of layouts
and elements. The available LAYOUTS TYPES are as
follows: "accentLeft", "accentRight",
"imageAndText", "textAndImage", "twoColumns",
"twoColumnsWithHeadings", "threeColumns",
"threeColumnsWithHeadings", "fourColumns",
"twoImageColumns", "threeImageColumns",
"fourImageColumns", "tableLayout".
The available CONTENT TYPES are "heading1",
"heading2", "heading3", "heading4", "title",
"paragraph", "table", "resizable-column", "image",
"blockquote", "numberedList", "bulletList",
"todoList", "calloutBox", "codeBlock",
"tableOfContents", "divider", "column"

Use these outlines as a starting point for the
content of the presentations
${JSON.stringify(outlineArray)}

The output must be an array of JSON objects.
1. Write layouts based on the specific outline provided. Do not use types that are not mentioned in the example layouts.
2. Ensuring each layout is unique.
3. Adhere to the structure of existing layouts
4. Fill placeholder data into content fields where required.
5. Generate unique image placeholders for the 'content' property of image components and also alt text according to the outline.
6. Ensure proper formatting and schema alignment for the output JSON.
7. First create LAYOUTS TYPES at the top most
level of the JSON output as follows
 ${JSON.stringify([
   {
     slideName: "Blank card",
     type: "blank-card",
     className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
     content: {},
   },
 ])}

8. The content property of each LAYOUTS TYPE should
start with "column" and within the columns content
property you can use any of the CONTENT TYPES I
provided above. Resizable-column, column and other
multi element contents should be an array because
you can have more elements inside them nested.
Static elements like title and paragraph should
have content set to a string. Here is an example of
what 1 layout with 1 column with 1 title inside
would look like:
${JSON.stringify([
  {
    slideName: "Blank card",
    type: "blank-card",
    className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
      ],
    },
  },
])}

9. Here is a final example of an example output
for you to get an idea
${JSON.stringify([
  {
    id: uuidv4(),
    slideName: "Blank card",
    type: "blank-card",
    className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
      ],
    },
  },
  {
    id: uuidv4(),
    slideName: "Accent left",
    type: "accentLeft",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      restrictDropTo: true,
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              content: "src/assets/premium.png",
              alt: "Title",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },
])}

For Images
The alt text should describe the image clearly and concisely.
Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects.
Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related).
Avoid using terms like "image of" or "picture of," and instead focus directly on the content and meaning.
Output the layouts in JSON format. Ensure there are no duplicate layouts across the array.

### Example Layouts:
${JSON.stringify(existingLayouts, null, 2)}

### Outline Array:
${JSON.stringify(outlineArray)}

For each entry in the outline array, generate:
- A unique JSON layout with creative designs.
- Properly filled content, including placeholders for image components.
- Clear and well-structured JSON data.
For Images
- The alt text should describe the image clearly and concisely.
- Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects.
- Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related).
- Avoid using terms like "image of" or "picture of," and instead focus directly on the content and meaning.
  Output the layouts in JSON format. Ensure there are no duplicate layouts across the array.`;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("🟢 Generating layouts...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `Here is the outline array: ${JSON.stringify(
            outlineArray
          )}. Just give the JSON response, nothing else.`,
        },
      ],
      max_tokens: 5000,
      temperature: 0.7,
    });

    let responseContent = completion?.choices?.[0]?.message?.content;

    if (!responseContent) {
      return { status: 400, error: "İçerik oluşturulmadı" };
    }

    try {
      const jsonResponse = JSON.parse(responseContent.replace(/```json|```/g, ""));
      await Promise.all(jsonResponse.map(replaceImagePlaceholders));
      console.log("✔ Layoutlar başarıyla oluşturuldu!");
      return { status: 200, data: jsonResponse };
    } catch (error) {
      console.log("🔴 ERROR:", error);
      throw new Error("Invalid JSON format received from AI");
    }
  } catch (error) {
    console.error("🔴 ERROR:", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Proje id' si gerekli" };
    }
    const user = await currentUser();
    if (!user) {
      return { status: 403, error: "Kullanıcı doğrulanmadı" };
    }

    const userExist = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userExist || !userExist.subscription) {
      return {
        status: 403,
        error: !userExist?.subscription
          ? "Kullanıcı aktif bir aboneliğe sahip değil"
          : "Kullanıcı veritabanında bulunamadı",
      };
    }

    const project = await client.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      return { status: 404, error: "Proje bulunamadı" };
    }

    if (!project.outlines || project.outlines.length === 0) {
      return { status: 400, error: "Projede hiç taslak yok" };
    }

    const layouts = await generateLayoutsJson(project.outlines);

    if (layouts.status !== 200) {
      console.log("test", layouts);
      return layouts;
    }

    await client.project.update({
      where: { id: projectId },
      data: { slides: layouts.data, themeName: theme },
    });

    return { status: 200, data: layouts.data };
  } catch (error) {
    console.error("⚫ ERROR:", error);
    return { status: 500, error: "Internal server error", data: [] };
  }
};
