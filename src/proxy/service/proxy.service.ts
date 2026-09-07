import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import { serviceConfig } from 'src/config/gateway.config';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  constructor(private readonly httpService: HttpService){}
  async proxyRequest(
    seriviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    data?: any,
    headers?: any,
    userInfo?: any,
  ){
    const service = serviceConfig[seriviceName]
    const url = `${service.url}${path}`;
    this.logger.log(`Proxying ${method} request to ${seriviceName}: ${url}`);
    try{
      const enhanceHeaders ={
        ...headers,
      'x-user-id': userInfo?.userId,
      'x-user-email': userInfo?.userEmail,
      'x-user-role': userInfo?.userRole
      }
      const response = await firstValueFrom(
        this.httpService.request({
          method: method.toLocaleLowerCase() as any,
          url,
          data,
          headers: enhanceHeaders,
          timeout: service.timeout
        })
      );
    }catch(error){
      this.logger.error(`${method} request to ${seriviceName}: ${url}`);
    }
  }
  async getServiceHeath(){}
}
