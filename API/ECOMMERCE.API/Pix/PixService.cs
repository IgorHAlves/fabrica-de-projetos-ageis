namespace Pix;

public class PixService
{
    public string pixKey = "14996002903";
    public string merchantName = "André Luís";
    public string merchantCity = "Marília";
        
    public string CreatePix(decimal value, string orderId)
    {
        
        var txId = orderId.Replace("-", "").Substring(0, 25);
        
        var payloadString = PixPayload.GenerateStaticPayload(pixKey, merchantName, merchantCity, txId, value);
        return payloadString;
    }
    
}