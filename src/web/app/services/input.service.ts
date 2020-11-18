import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InputService {
    private cache = new Map<number, string>();

    constructor(private httpClient: HttpClient) { }

    async getInput(day: number): Promise<string> {
        if (!this.cache.has(day)) {
            try {
                const result = await this.httpClient.get(`assets/input/day${day.toString().padStart(2, '0')}.txt`, {
                    responseType: 'text'
                }).toPromise();
                this.cache.set(day, result);
            } catch (error) {
                console.log(error);
                return undefined;
            }
        }

        return this.cache.get(day);
    }
}
