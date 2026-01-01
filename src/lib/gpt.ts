import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gemini-2.0-flash",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
) {
  const list_input = Array.isArray(user_prompt);
  const dynamic_elements = /<.*?>/.test(JSON.stringify(output_format));
  const list_output = /\[.*?\]/.test(JSON.stringify(output_format));

  let error_msg = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt = `
You must output ${
      list_output ? "an array of objects in" : ""
    } **valid JSON only** matching this schema:
${JSON.stringify(output_format, null, 2)}

Rules:
- No markdown
- No explanations
- No escaped characters
- No quotes around keys unless required by JSON
`;

    if (list_output) {
      output_format_prompt += `
If a field is a list, choose the best matching value.
`;
    }

    if (dynamic_elements) {
      output_format_prompt += `
Text inside < > must be generated.
Keys inside < > must be replaced with generated keys.
`;
    }

    if (list_input) {
      output_format_prompt += `
Return an array of JSON objects, one per input.
`;
    }

    const generativeModel = genAI.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature,
        responseMimeType: "application/json",
      },
    });

    const fullPrompt = `${system_prompt}\n\n${output_format_prompt}\n\n${error_msg}\n\nUser input:\n${
      Array.isArray(user_prompt) ? user_prompt.join("\n") : user_prompt
    }`;

    const result = await generativeModel.generateContent(fullPrompt);
    const response = await result.response;
    let res = response.text();

    // normalize quotes safely
    res = res.replace(/(\w)"(\w)/g, "$1'$2");

    if (verbose) {
      console.log("SYSTEM:", system_prompt + output_format_prompt + error_msg);
      console.log("USER:", user_prompt);
      console.log("RAW RESPONSE:", res);
    }

    try {
      let output: any = JSON.parse(res);

      if (list_input && !Array.isArray(output)) {
        throw new Error("Expected array output");
      }

      if (!list_input) {
        output = [output];
      }

      for (let item of output) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) continue;

          if (!(key in item)) {
            throw new Error(`Missing key: ${key}`);
          }

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];

            if (Array.isArray(item[key])) {
              item[key] = item[key][0];
            }

            if (!choices.includes(item[key]) && default_category) {
              item[key] = default_category;
            }

            if (typeof item[key] === "string" && item[key].includes(":")) {
              item[key] = item[key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          const values = Object.values(item);
          item = values.length === 1 ? values[0] : values;
        }
      }

      return list_input ? output : output[0];
    } catch (err) {
      error_msg = `\nInvalid JSON:\n${res}\nError:\n${err}`;
      if (verbose) {
        console.error("Parse error:", err);
      }
    }
  }

  return [];
}
