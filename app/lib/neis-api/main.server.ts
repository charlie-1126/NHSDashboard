import axios from 'axios';
import type {
  AcademyRequest,
  AcademyResponse,
  BaseResponse,
  ClassInfoRequest,
  ClassInfoResponse,
  ESTimeTableRequest,
  ESTimeTableResponse,
  HSTimeTableRequest,
  HSTimeTableResponse,
  MealRequest,
  MealResponse,
  MSTimeTableRequest,
  MSTimeTableResponse,
  SchoolAflcoInfoRequest,
  SchoolAflcoInfoResponse,
  SchoolInfoRequest,
  SchoolInfoResponse,
  SchoolMajorInfoRequest,
  SchoolMajorInfoResponse,
  SchoolScheduleRequest,
  SchoolScheduleResponse,
  SSTimeTableRequest,
  SSTimeTableResponse,
  TiClrminfoRequest,
  TiClrminfoResponse,
} from './interfaces';
import { cacheService } from './cache';

export class NeisAPIService {
  private readonly axios = axios.create({
    baseURL: 'https://open.neis.go.kr',
    validateStatus: () => true,
    timeout: 3000,
  });

  private readonly cacheService = cacheService;

  constructor() {
    if (!import.meta.env.VITE_NEIS_API_KEY) throw new Error('NEIS_API_KEY is not defined');
    this.axios.defaults.params = {
      KEY: import.meta.env.VITE_NEIS_API_KEY,
      Type: 'json',
      pIndex: 1,
      pSize: 100,
    };
  }

  /**
   * 학교 기본정보에 대한 학교명, 소재지, 주소, 전화번호, 홈페이지주소, 남녀공학여부, 주야구분, 개교기념일 등을 확인할 수 있는 현황입니다.
   * @param data
   */
  public async schoolInfoNeis(data: SchoolInfoRequest): Promise<SchoolInfoResponse> {
    return await this.get<SchoolInfoResponse>('/hub/schoolInfo', data);
  }

  /**
   * 학교명 등의 검색 조건을 선택하여 반정보를 검색할 수 있습니다.
   * @param data
   */
  public async classInfoNeis(data: ClassInfoRequest): Promise<ClassInfoResponse> {
    return await this.get<ClassInfoResponse>('/hub/classInfo', data);
  }

  /**
   * 학교명 등의 검색 조건을 선택하여 학교학과정보를 검색할 수 있습니다.
   * @param data
   */
  public async majorInfoNeis(data: SchoolMajorInfoRequest): Promise<SchoolMajorInfoResponse> {
    return await this.get<SchoolMajorInfoResponse>('/hub/schoolMajorinfo', data);
  }

  /**
   * 학교명 등의 검색 조건을 선택하여 학교계열정보를 검색할 수 있습니다.
   * @param data
   */
  public async AflocoInfoNeis(data: SchoolAflcoInfoRequest): Promise<SchoolAflcoInfoResponse> {
    return await this.get<SchoolAflcoInfoResponse>('/hub/schulAflcoinfo', data);
  }

  /**
   * 고등학교 학년도, 학교, 계열, 학과, 학기, 학년, 강의실, 교시별 시간표 수업내용을 확인할 수 있는 현황입니다.
   * @param data
   */
  public async hSTimeTableNeis(data: HSTimeTableRequest): Promise<HSTimeTableResponse> {
    return await this.get<HSTimeTableResponse>('/hub/hisTimetable', data);
  }

  /**
   * 학년도, 학교별 주요 행사 정보에 대한 학사일자, 행사명, 행사내용, 학년별 행사여부 등의 현황입니다.
   * @param data
   */
  public async scheduleNeis(data: SchoolScheduleRequest): Promise<SchoolScheduleResponse> {
    return await this.get<SchoolScheduleResponse>('/hub/SchoolSchedule', data);
  }

  /**
   * 중학교 학년도, 학교, 학기, 학년, 학급, 교시별 시간표 수업내용을 확인할 수 있는 현황입니다.
   * @param data
   */
  public async mSTimeTableNeis(data: MSTimeTableRequest): Promise<MSTimeTableResponse> {
    return await this.get<MSTimeTableResponse>('/hub/misTimetable', data);
  }

  /**
   * 초등학교 학년도, 학교, 학기, 학년, 학급, 교시별 시간표 수업내용을 확인할 수 있는 현황입니다.
   * @param data
   */
  public async eSTimeTableNeis(data: ESTimeTableRequest): Promise<ESTimeTableResponse> {
    return await this.get<ESTimeTableResponse>('/hub/elsTimetable', data);
  }

  /**
   * 특수학교 학년도, 학교, 학기, 학년, 과정, 강의실, 교시별 시간표 수업내용을 확인할 수 있는 현황입니다.
   * @param data
   */
  public async sSTimeTableNeis(data: SSTimeTableRequest): Promise<SSTimeTableResponse> {
    return await this.get<SSTimeTableResponse>('/hub/spsTimetable', data);
  }

  /**
   * 학교명 등의 검색 조건을 선택하여 시간표강의실 정보를 검색할 수 있습니다.
   * @param data
   */
  public async tiClrmInfoNeis(data: TiClrminfoRequest): Promise<TiClrminfoResponse> {
    return await this.get<TiClrminfoResponse>('/hub/tiClrminfo', data);
  }

  /**
   * 개설되어있는 학원 및 교습소의 학원명, 휴원일자, 등록상태, 정원, 분야, 계열 및 과정을 확인할 수 있으며 수강료 공개여부에 따라 수강료 내용을 확인할 수 있습니다.
   * @param data
   */
  public async academyInfoNeis(data: AcademyRequest): Promise<AcademyResponse> {
    return await this.get<AcademyResponse>('/hub/acaInsTiInfo', data);
  }

  /**
   * 학교에서 제공하는 현재년도 급식의 요리명, 원산지정보, 칼로리정보, 영양정보 등의 일자별 현황입니다.
   * @param data
   */
  public async mealInfoNeis(data: MealRequest): Promise<MealResponse> {
    return await this.get<MealResponse>('/hub/mealServiceDietInfo', data);
  }

  private async get<T extends BaseResponse>(url: string, data: object): Promise<T> {
    const cacheKey = Object.values({
      ...data,
      ...this.axios.defaults.params,
    })
      .sort()
      .join(':');
    const cache = await this.cacheService.get<T>(cacheKey);

    /** cache hit */
    if (cache) {
      return cache;
    }

    /** cache miss */
    const res = await this.axios.get<T>(url, {
      params: data,
    });
    const key = Object.keys(res.data)[0];

    if ((res.data as { RESULT?: unknown }).RESULT) {
      return {
        head: {
          RESULT: (res.data as { RESULT?: BaseResponse['head']['RESULT'] }).RESULT,
        },
      } as T;
    } else {
      const response = {
        head: {
          list_total_count:
            (Array.isArray(res.data[key]) &&
              (res.data[key][0] as { head: BaseResponse['head'][] })?.head?.[0]
                ?.list_total_count) ||
            0,
          RESULT:
            (Array.isArray(res.data[key]) &&
              (res.data[key][0] as { head: BaseResponse['head'][] }).head[1]?.RESULT) ||
            {},
        },
        row:
          (Array.isArray(res.data[key]) &&
            (res.data[key][1] as { row: BaseResponse['row'] }).row) ||
          [],
      } as T;
      /** cache set */
      await this.cacheService.set(cacheKey, response, 60 * 60 * 60);
      return response;
    }
  }
}
