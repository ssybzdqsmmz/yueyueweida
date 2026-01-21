// src/services/neo4jService.js
import neo4j from 'neo4j-driver';

// 创建一个 Neo4j 驱动实例
const driver = neo4j.driver(
  'bolt://localhost:7687', // Neo4j Bolt 协议地址
  neo4j.auth.basic('neo4j', '12345678') // 你的 Neo4j 用户名和密码
);

const getGraphData = async (query) => {
  const session = driver.session();
  try {
    const result = await session.run(query);
    return result.records.map((record) => record.toObject());
  } finally {
    await session.close();
  }
};

export default {
  getGraphData,
};
