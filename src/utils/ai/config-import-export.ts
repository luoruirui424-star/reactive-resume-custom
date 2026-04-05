/**
 * AI 配置导入导出工具
 */

export interface AIConfigExport {
  version: string;
  timestamp: string;
  config: {
    enabled: boolean;
    provider: string;
    model: string;
    apiKey: string;
    baseURL: string;
    testStatus: string;
  };
}

/**
 * 导出 AI 配置到文件
 */
export function exportAIConfig(config: {
  enabled: boolean;
  provider: string;
  model: string;
  apiKey: string;
  baseURL: string;
  testStatus: string;
}): void {
  const exportData: AIConfigExport = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    config: {
      enabled: config.enabled,
      provider: config.provider,
      model: config.model,
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      testStatus: config.testStatus,
    },
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  // 创建下载链接
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-config-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 从文件导入 AI 配置
 */
export function importAIConfig(file: File): Promise<{
  enabled: boolean;
  provider: string;
  model: string;
  apiKey: string;
  baseURL: string;
  testStatus: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData: AIConfigExport = JSON.parse(content);

        // 验证文件格式
        if (!importData.version || !importData.config) {
          throw new Error("Invalid configuration file format");
        }

        // 验证必需字段
        const config = importData.config;
        if (typeof config.enabled !== "boolean" ||
            typeof config.provider !== "string" ||
            typeof config.model !== "string" ||
            typeof config.apiKey !== "string" ||
            typeof config.baseURL !== "string" ||
            typeof config.testStatus !== "string") {
          throw new Error("Configuration file contains invalid data types");
        }

        resolve(config);
      } catch (error) {
        reject(new Error(`Failed to parse configuration file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read configuration file"));
    };

    reader.readAsText(file);
  });
}

/**
 * 验证导入的配置数据
 */
export function validateImportedConfig(config: any): config is {
  enabled: boolean;
  provider: string;
  model: string;
  apiKey: string;
  baseURL: string;
  testStatus: string;
} {
  return (
    typeof config === "object" &&
    config !== null &&
    typeof config.enabled === "boolean" &&
    typeof config.provider === "string" &&
    typeof config.model === "string" &&
    typeof config.apiKey === "string" &&
    typeof config.baseURL === "string" &&
    typeof config.testStatus === "string" &&
    ["unverified", "success", "failure"].includes(config.testStatus)
  );
}