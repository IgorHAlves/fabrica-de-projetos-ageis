using System;
using System.Text;
using System.Globalization;

namespace Pix
{
    public class PixPayload
    {
        // Método auxiliar para formatar os campos (ID + Comprimento + Valor)
        private static string FormatField(string id, string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            // O comprimento (Length) deve ter 2 dígitos
            return $"{id}{value.Length:D2}{value}";
        }

        // Função que calcula o CRC16 (CCITT-16) necessário para o final do payload
        private static string CalculateCrc16(string payload)
        {
            // Padrão CRC-16/CCITT-FALSE (Polinômio: 0x1021, Inicial: 0xFFFF, Final XOR: 0x0000)
            ushort initialCrc = 0xFFFF;
            ushort polynomial = 0x1021;
            ushort crc = initialCrc;

            byte[] bytes = Encoding.ASCII.GetBytes(payload);

            foreach (byte b in bytes)
            {
                crc ^= (ushort)(b << 8);
                for (int i = 0; i < 8; i++)
                {
                    if ((crc & 0x8000) != 0)
                    {
                        crc = (ushort)((crc << 1) ^ polynomial);
                    }
                    else
                    {
                        crc <<= 1;
                    }
                }
            }

            // Retorna o valor em hexadecimal com 4 dígitos maiúsculos
            return crc.ToString("X4");
        }

        /// <summary>
        /// Monta o payload (string) do QR Code Pix Estático.
        /// </summary>
        /// <param name="pixKey">Chave Pix do recebedor.</param>
        /// <param name="merchantName">Nome do recebedor (Max 25 caracteres).</param>
        /// <param name="merchantCity">Cidade do recebedor (Max 15 caracteres).</param>
        /// <param name="txId">ID da transação (Opcional, Max 25 caracteres. Use "***" para Pix estático sem ID).</param>
        /// <param name="amount">Valor da cobrança (Opcional. Ex: 15.50). Deixe null para valor aberto.</param>
        /// <returns>A string completa do payload EMV (BR Code).</returns>
        public static string GenerateStaticPayload(
            string pixKey,
            string merchantName,
            string merchantCity,
            string txId = "***",
            decimal? amount = null)
        {
            // 1. Campos Fixos (Payload Format Indicator, Point of Initiation Method, Currency)
            string payload = "";
            payload += FormatField("00", "01"); // Payload Format Indicator (01)
            payload += FormatField("01", "11"); // Point of Initiation Method (Estático)

            // 2. Merchant Account Information (ID 26) - Composto
            string merchantAccountInfo = "";
            merchantAccountInfo += FormatField("00", "br.gov.bcb.pix"); // GUID
            merchantAccountInfo += FormatField("01", pixKey); // Chave Pix
            merchantAccountInfo += FormatField("05", txId); // Transaction ID
            payload += FormatField("26", merchantAccountInfo);

            // 3. Campos do Recebedor e Moeda
            payload += FormatField("52", "0000"); // Merchant Category Code (Fixo '0000')
            payload += FormatField("53", "986"); // Transaction Currency (Real Brasileiro: 986)

            // 4. Valor (Opcional - Campo 54)
            if (amount.HasValue)
            {
                // Formata o valor com ponto como separador decimal e 2 casas decimais
                string amountStr = amount.Value.ToString("F2", CultureInfo.InvariantCulture);
                payload += FormatField("54", amountStr);
            }

            // 5. Outros Campos do Recebedor
            payload += FormatField("58", "BR"); // Country Code (Brasil)
            payload += FormatField("59", merchantName.PadRight(25).Substring(0, 25).Trim()); // Nome
            payload += FormatField("60", merchantCity.PadRight(15).Substring(0, 15).Trim()); // Cidade

            // 6. Bloco CRC16 (Campo 63) - Deve incluir o ID e o Comprimento do próprio campo 63
            string finalPayloadBase = payload + "6304";
            string crcValue = CalculateCrc16(finalPayloadBase);

            // 7. Payload Final
            string finalPayload = finalPayloadBase + crcValue;

            return finalPayload;
        }

    }
}