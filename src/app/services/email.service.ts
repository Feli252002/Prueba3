import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'https://api.elasticemail.com/v4/emails';
 private apiKey = '9CAB9CAB69FD38F329896467AA919B5886CC3B788ABE7721DEC156BD7F5EE8546FA7CBBBEB46BE8B05F1926FF7CE25A2';

  constructor(private http: HttpClient) { }

  enviarConfirmacion(to: string, subject: string, body: string) {
    const data = {
      apikey: this.apiKey,
      to: to,
      subject: subject,
      bodyHtml: body,
      isTransactional: true
    };

    return this.http.post(this.apiUrl, data);
 }

}
