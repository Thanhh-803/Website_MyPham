using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Net;

namespace OrdersService.Repository
{
    public class ApiClientHelper
    {
        private readonly HttpClient _client;

        public ApiClientHelper()
        {
            // ⚠️ Bỏ qua kiểm tra chứng chỉ SSL
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback =
                    (message, cert, chain, errors) => true
            };

            _client = new HttpClient(handler);
        }

        public async Task<string> GetAsync(string baseUrl, string token = null)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, baseUrl);

                if (!string.IsNullOrEmpty(token))
                {
                    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                }

                var response = await _client.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return responseContent;
                }

                Console.WriteLine($"Lỗi API: {response.StatusCode} - {responseContent}");
                return $"Lỗi API: {response.StatusCode} - {responseContent}";
            }
            catch (Exception ex)
            {
                return $"Lỗi khi gọi API: {ex.Message}";
            }
        }


        public async Task<string> DeleteAsync(string url, string token = null)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Delete, url);

                if (!string.IsNullOrEmpty(token))
                {
                    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                }

                var response = await _client.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return responseContent;
                }

                Console.WriteLine($"Lỗi API DELETE: {response.StatusCode} - {responseContent}");
                return $"Lỗi API DELETE: {response.StatusCode} - {responseContent}";
            }
            catch (Exception ex)
            {
                return $"Lỗi khi gọi API DELETE: {ex.Message}";
            }
        }



    }
}
