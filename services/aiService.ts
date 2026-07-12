import { ClaudeConfig } from '../constants/config';
import { DocumentAnalysisResult, ExtractedField } from '../types';

export async function analyzeDocumentImage(
  base64Image: string
): Promise<DocumentAnalysisResult> {
  if (!ClaudeConfig.apiKey) {
    return {
      fields: [],
      error: 'Claude API key not configured',
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ClaudeConfig.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ClaudeConfig.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Analyze this document image and extract all visible information.
Return the extracted data as a JSON object with this structure:
{
  "fields": [
    {"label": "Field Name", "key": "field_name", "value": "extracted value"}
  ]
}

If the document appears empty or blank, return:
{
  "fields": [],
  "rawText": "Empty document"
}

Only return valid JSON, no additional text.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as { error?: { message?: string } };
      return {
        fields: [],
        error: `API error: ${errorData.error?.message ?? 'Unknown error'}`,
      };
    }

    const data = await response.json() as { content: Array<{ type: string; text: string }> };
    const content = data.content[0];

    if (content.type !== 'text') {
      return {
        fields: [],
        error: 'Unexpected response format',
      };
    }

    const jsonText = content.text;
    const parsed = JSON.parse(jsonText) as { fields?: ExtractedField[]; rawText?: string };

    if (parsed.fields && Array.isArray(parsed.fields)) {
      return {
        fields: parsed.fields,
        rawText: parsed.rawText,
      };
    }

    return {
      fields: [],
      rawText: parsed.rawText ?? undefined,
      error: 'Invalid response structure',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      fields: [],
      error: `Analysis failed: ${errorMessage}`,
    };
  }
}
