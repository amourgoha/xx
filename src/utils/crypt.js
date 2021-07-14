// 密钥对生成 http://web.chacuo.net/netrsakeypair

/* const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
  '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ==' */
  const publicKey = '040480e60b1731b0e1aa22ce869391d47e04bd7fb96da647135dab2d6f9f92795af7eb483ae6231b10ba940be14bf804cd38783be3a944f78dd6466abb15dd780d'
const privateKey = '3c57e71a38d5fa439ae40c7b815d7468c718002647b2cba7ca6859bc96f78915'

export function encrypt(msgString) {
  let msg = msgString;
  if (typeof (msgString) !== 'string') {
  msg = JSON.stringify(msgString);
  }
  let sm2 = require('sm-crypto').sm2;
  let cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1
  let encryptData = sm2.doEncrypt(msg, publicKey, cipherMode); // 加密结果
  return '04'+ encryptData;
} 
// 加密
/* export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
} */

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

