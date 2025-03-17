export interface BaseResponse {
  head: {
    list_total_count: number;
    RESULT: {
      CODE:
        | 'ERROR-300'
        | 'ERROR-290'
        | 'ERROR-310'
        | 'ERROR-333'
        | 'ERROR-336'
        | 'ERROR-337'
        | 'ERROR-500'
        | 'ERROR-600'
        | 'ERROR-601'
        | 'INFO-000'
        | 'INFO-100'
        | 'INFO-300'
        | 'INFO-200';
      MESSAGE: string;
    };
  };
  row: object[];
  [key: string]: any;
}

export interface BaseRequest {
  /**
   * 페이지 위치
   *
   * @default 1
   */
  pIndex?: number;
  /**
   * 페이지 당 신청 숫자
   *
   * @default 100
   */
  pSize?: number;
}

export interface SchoolInfoResponse extends BaseResponse {
  row: {
    /** 시도교육청 코드 - 학교를 관리하는 시도교육청 기관코드 */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 - 학교를 관리하는 시도교육청 명칭 */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 - 각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드 */
    SD_SCHUL_CODE: string;

    /** 학교명 - 학교의 명칭 */
    SCHUL_NM: string;

    /** 영문학교명 - 학교의 영문 이름 */
    ENG_SCHUL_NM: string;

    /** 학교종류명 - 학교의 종류 */
    SCHUL_KND_SC_NM: '고등학교' | '중학교' | '초등학교' | '특수학교';

    /** 시도명 - 학교가 소속되어 있는 시도교육청이 위치한 시도 */
    LCTN_SC_NM: string;

    /** 관할조직명 - 학교가 소속되어 있는 있는 지역의 관할 시도교육청 */
    JU_ORG_NM: string;

    /** 설립명 - 학교의 설립주체에 따른 구분 */
    FOND_SC_NM: string;

    /** 도로명우편번호 - 학교의 도로명주소 우편번호 */
    ORG_RDNZC: string;

    /** 도로명주소 - 학교의 도로명주소 */
    ORG_RDNMA: string;

    /** 도로명상세주소 - 학교의 도로명주소의 상세주소 */
    ORG_RDNDA: string;

    /** 전화번호 - 학교의 대표 전화번호 */
    ORG_TELNO: string;

    /** 홈페이지주소 - 학교의 홈페이지 주소 (URL) */
    HMPG_ADRES: string;

    /** 남녀공학구분명 - 서로 다른 성별의 학생이 같은 학급 혹은 같은 학교에 다니는 제도에 따른 구분 */
    COEDU_SC_NM: string;

    /** 팩스번호 - 학교의 대표 팩스번호 */
    ORG_FAXNO: string;

    /** 고등학교구분명 - 고등학교의 교육과정에 따른 구분 */
    HS_SC_NM: string;

    /** 산업체특별학급존재여부 - 산업체에 근무하는 청소년들에게 중등학교 과정의 교육기회를 제공하는 학급 또는 학교의 구분 */
    INDST_SPECL_CCCCL_EXST_YN: string;

    /** 고등학교일반전문구분명 - 고등학교의 일반계 또는 전문계에 따른 구분 */
    HS_GNRL_BUSNS_SC_NM: string;

    /** 특수목적고등학교계열명 - 특수목적고등학교에서 운영하는 교육과정의 유사한 학습 형태 */
    SPCLY_PURPS_HS_ORD_NM: string;

    /** 입시전후기구분명 - 고등학교 입시 모집 시기에 따른 구분 */
    ENE_BFE_SEHF_SC_NM: string;

    /** 주야구분명 - 학교의 정규수업 시간에 따른 주간과 야간과정의 구분 */
    DGHT_SC_NM: string;

    /** 설립일자 - 학교의 설립인가를 받은 일자 */
    FOND_YMD: string;

    /** 개교기념일 - 학교의 설립 이후 학생들이 처음으로 입학한 일자 */
    FOAS_MEMRD: string;

    /** 수정일자 - 정보가 수정 및 저장된 일자 */
    LOAD_DTM: string;
  }[];
}

export interface SchoolInfoRequest extends BaseRequest {
  /** 학교를 관리하는 시도교육청 기관코드 (선택) */
  ATPT_OFCDC_SC_CODE?: string;

  /** 각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드 (선택) */
  SD_SCHUL_CODE?: string;

  /** 학교의 명칭 (선택) */
  SCHUL_NM?: string;

  /** 학교의 종류 (선택) */
  SCHUL_KND_SC_NM?: '고등학교' | '중학교' | '초등학교' | '특수학교';

  /** 학교가 소속되어 있는 시도교육청이 위치한 시도 (선택) */
  LCTN_SC_NM?: string;

  /** 학교의 설립주체에 따른 구분 (선택) */
  FOND_SC_NM?: string;
}

export interface ClassInfoResponse extends BaseResponse {
  row: {
    /** 시도교육청 코드 */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 */
    SD_SCHUL_CODE: string;

    /** 학교명 */
    SCHUL_NM: string;

    /** 학년도 */
    AY: string;

    /** 학년 */
    GRADE: string;

    /** 주야과정명 */
    DGHT_CRSE_SC_NM: string;

    /** 학교과정명 */
    SCHUL_CRSE_SC_NM: string;

    /** 계열명 */
    ORD_SC_NM: string;

    /** 학과명 */
    DDDEP_NM: string;

    /** 학급명 */
    CLASS_NM: string;

    /** 수정일자 */
    LOAD_DTM: string;
  }[];
}

export interface ClassInfoRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string;

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string;

  /** 학년도 (선택) */
  AY?: string;

  /** 학년 (선택) */
  GRADE?: string;

  /** 주야과정명 (선택) */
  DGHT_CRSE_SC_NM?: string;

  /** 학교과정명 (선택) */
  SCHUL_CRSE_SC_NM?: string;

  /** 계열명 (선택) */
  ORD_SC_NM?: string;

  /** 학과명 (선택) */
  DDDEP_NM?: string;
}

export interface SchoolMajorInfoResponse extends BaseResponse {
  row: {
    /** 시도교육청 코드 */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 */
    SD_SCHUL_CODE: string;

    /** 학교명 */
    SCHUL_NM: string;

    /** 주야과정명 */
    DGHT_CRSE_SC_NM: string;

    /** 계열명 */
    ORD_SC_NM: string;

    /** 학과명 */
    DDDEP_NM: string;

    /** 수정일자 */
    LOAD_DTM: string;
  }[];
}

export interface SchoolMajorInfoRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string;

  /** 행정표준코드 (선택) */
  SD_SCHUL_CODE?: string;

  /** 주야과정명 (선택) */
  DGHT_CRSE_SC_NM?: string;

  /** 계열명 (선택) */
  ORD_SC_NM?: string;
}

export interface SchoolAflcoInfoResponse extends BaseResponse {
  row: {
    /** 시도교육청 코드 */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 */
    SD_SCHUL_CODE: string;

    /** 학교명 */
    SCHUL_NM: string;

    /** 주야과정명 */
    DGHT_CRSE_SC_NM: string;

    /** 계열명 */
    ORD_SC_NM: string;

    /** 수정일자 */
    LOAD_DTM: string;
  }[];
}

export interface SchoolAflcoInfoRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string;

  /** 행정표준코드 (선택) */
  SD_SCHUL_CODE?: string;

  /** 주야과정명 (선택) */
  DGHT_CRSE_SC_NM?: string;
}

export interface HSTimeTableResponse extends BaseResponse {
  row: {
    /** 시도교육청 코드 (학교를 관리하는 시도교육청 기관코드) */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 (학교를 관리하는 시도교육청 명칭) */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 (각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드) */
    SD_SCHUL_CODE: string;

    /** 학교명 (교육청에서 관리하는 학교의 명칭 * 기관의 전체시설명) */
    SCHUL_NM: string;

    /** 학년도 (한 학년의 과정을 배우는 기간) */
    AY: string;

    /** 학기 (한 학년 동안을 학업의 필요에 의하여 구분한 기간) */
    SEM: string;

    /** 시간표일자 (한 학기 동안 도표로 짜여진 학과목의 수업일) */
    ALL_TI_YMD: string;

    /** 주야과정명 (학습시간에 따라 주간과 야간과정으로 구분) */
    DGHT_CRSE_SC_NM: string;

    /** 계열명 (학교마다 운영하는 교육과정의 유사한 학습 형태) */
    ORD_SC_NM: string;

    /** 학과명 (학교마다 운영하는 학년별 교육과정) */
    DDDEP_NM: string;

    /** 학년 (1년간의 학습 과정의 단위) */
    GRADE: string;

    /** 강의실명 (학습활동이 이루어지는 장소) */
    CLRM_NM: string;

    /** 학급명 (한 교실에서 공부하는 학생으로 구성된 집단의 명칭) */
    CLASS_NM: string;

    /** 교시 (학교의 수업시간을 세는 단위) */
    PERIO: string;

    /** 수업내용 (시간표에 따라 학급(반)별로 교사가 학생을 가르치는 모든 활동) */
    ITRT_CNTNT: string;

    /** 수정일자 (시간표 정보가 수정 및 저장된 일자) */
    LOAD_DTM: string;
  }[];
}

export interface HSTimeTableRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string; // 학교를 관리하는 시도교육청 기관코드

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string; // 각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드

  /** 학년도 (선택) */
  AY?: string; // 한 학년의 과정을 배우는 기간

  /** 학기 (선택) */
  SEM?: string; // 한 학년 동안을 학업의 필요에 의하여 구분한 기간

  /** 시간표일자 (선택) */
  ALL_TI_YMD?: string; // 한 학기 동안 도표로 짜여진 학과목의 수업일

  /** 주야과정명 (선택) */
  DGHT_CRSE_SC_NM?: string; // 학습시간에 따라 주간과 야간과정으로 구분

  /** 계열명 (선택) */
  ORD_SC_NM?: string; // 학교마다 운영하는 교육과정의 유사한 학습 형태

  /** 학과명 (선택) */
  DDDEP_NM?: string; // 학교마다 운영하는 학년별 교육과정

  /** 학년 (선택) */
  GRADE?: string; // 1년간의 학습 과정의 단위

  /** 강의실명 (선택) */
  CLRM_NM?: string; // 학습활동이 이루어지는 장소

  /** 학급명 (선택) */
  CLASS_NM?: string; // 한 교실에서 공부하는 학생으로 구성된 집단의 명칭

  /** 시간표시작일자 (선택) */
  TI_FROM_YMD?: string;

  /** 시간표종료일자 (선택) */
  TI_TO_YMD?: string;
}

export interface SchoolScheduleResponse extends BaseResponse {
  row: {
    /** 시도교육청코드 */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 */
    SD_SCHUL_CODE: string;

    /** 학교명 */
    SCHUL_NM: string;

    /** 학년도 */
    AY: string;

    /** 주야과정명 (주야과정구분명) */
    DGHT_CRSE_SC_NM: string;

    /** 학교과정명 (학교과정구분명) */
    SCHUL_CRSE_SC_NM: string;

    /** 수업공제일명 (수업공제일구분명) */
    SBTR_DD_SC_NM: string;

    /** 학사일자 */
    AA_YMD: string;

    /** 행사명 */
    EVENT_NM: string;

    /** 행사내용 */
    EVENT_CNTNT: string;

    /** 1학년행사여부 */
    ONE_GRADE_EVENT_YN: string;

    /** 2학년행사여부 */
    TW_GRADE_EVENT_YN: string;

    /** 3학년행사여부 */
    THREE_GRADE_EVENT_YN: string;

    /** 4학년행사여부 */
    FR_GRADE_EVENT_YN: string;

    /** 5학년행사여부 */
    FIV_GRADE_EVENT_YN: string;

    /** 6학년행사여부 */
    SIX_GRADE_EVENT_YN: string;

    /** 수정일자 (적재일시) */
    LOAD_DTM: string;
  }[];
}

export interface SchoolScheduleRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string; // 시도교육청구분코드

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string; // 행정표준코드

  /** 주야과정명 (선택) */
  DGHT_CRSE_SC_NM?: string; // 주야과정구분명

  /** 학교과정명 (선택) */
  SCHUL_CRSE_SC_NM?: string; // 학교과정구분명

  /** 학사일자 (선택) */
  AA_YMD?: string; // 학사일자

  /** 학사시작일자 (선택) */
  AA_FROM_YMD?: string; // 학사시작일자

  /** 학사종료일자 (선택) */
  AA_TO_YMD?: string; // 학사종료일자
}

export interface MSTimeTableResponse extends BaseResponse {
  row: {
    /** 시도교육청 코드 (학교를 관리하는 시도교육청 기관코드) */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 (학교를 관리하는 시도교육청 명칭) */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 (각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드) */
    SD_SCHUL_CODE: string;

    /** 학교명 (학교의 부르는 명칭) */
    SCHUL_NM: string;

    /** 학년도 (한 학년의 과정을 배우는 기간) */
    AY: string;

    /** 학기 (한 학년 동안을 학업의 필요에 의하여 구분한 기간) */
    SEM: string;

    /** 시간표일자 (한 학기 동안 도표로 짜여진 학과목의 수업일) */
    ALL_TI_YMD: string;

    /** 주야과정명 (학습시간에 따른 주간과 야간과정의 구분) */
    DGHT_CRSE_SC_NM: string;

    /** 학년 (1년간의 학습 과정의 단위) */
    GRADE: string;

    /** 학급명 (한 교실에서 공부하는 학생으로 구성된 집단의 명칭) */
    CLASS_NM: string;

    /** 교시 (학교의 수업시간을 세는 단위) */
    PERIO: string;

    /** 수업내용 (시간표에 따라 학급(반)별로 교사가 학생을 가르치는 모든 활동) */
    ITRT_CNTNT: string;

    /** 수정일자 (시간표 정보가 수정 및 저장된 일자) */
    LOAD_DTM: string;
  }[];
}

export interface MSTimeTableRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string; // 학교를 관리하는 시도교육청 기관코드

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string; // 각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드

  /** 학년도 (선택) */
  AY?: string; // 한 학년의 과정을 배우는 기간

  /** 학기 (선택) */
  SEM?: string; // 한 학년 동안을 학업의 필요에 의하여 구분한 기간

  /** 시간표일자 (선택) */
  ALL_TI_YMD?: string; // 한 학기 동안 도표로 짜여진 학과목의 수업일

  /** 주야과정명 (선택) */
  DGHT_CRSE_SC_NM?: string; // 학습시간에 따른 주간과 야간과정의 구분

  /** 학년 (선택) */
  GRADE?: string; // 1년간의 학습 과정의 단위

  /** 학급명 (선택) */
  CLASS_NM?: string; // 한 교실에서 공부하는 학생으로 구성된 집단의 명칭

  /** 교시 (선택) */
  PERIO?: string; // 학교의 수업시간을 세는 단위

  /** 시간표시작일자 (선택) */
  TI_FROM_YMD?: string;

  /** 시간표종료일자 (선택) */
  TI_TO_YMD?: string;
}

export interface ESTimeTableResponse extends BaseResponse {
  row: {
    /** 시도교육청 코드 (학교를 관리하는 시도교육청 기관코드) */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 (학교를 관리하는 시도교육청 명칭) */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 (각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드) */
    SD_SCHUL_CODE: string;

    /** 학교명 (교육청에서 관리하는 학교의 명칭) */
    SCHUL_NM: string;

    /** 학년도 (한 학년의 과정을 배우는 기간) */
    AY: string;

    /** 학기 (한 학년 동안을 학업의 필요에 의하여 구분한 기간) */
    SEM: string;

    /** 시간표일자 (한 학기 동안 도표로 짜여진 학과목의 수업일) */
    ALL_TI_YMD: string;

    /** 학년 (1년간의 학습 과정의 단위) */
    GRADE: string;

    /** 학급명 (한 교실에서 공부하는 학생으로 구성된 집단의 명칭) */
    CLASS_NM: string;

    /** 교시 (학교의 수업시간을 세는 단위) */
    PERIO: string;

    /** 수업내용 (시간표에 따라 학급(반)별로 교사가 학생을 가르치는 모든 활동) */
    ITRT_CNTNT: string;

    /** 수정일자 (시간표 정보가 수정 및 저장된 일자) */
    LOAD_DTM: string;
  }[];
}

export interface ESTimeTableRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string;

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string;

  /** 학년도 (선택) */
  AY?: string;

  /** 학기 (선택) */
  SEM?: string;

  /** 시간표일자 (선택) */
  ALL_TI_YMD?: string;

  /** 학년 (선택) */
  GRADE?: string;

  /** 학급명 (선택) */
  CLASS_NM?: string;

  /** 교시 (선택) */
  PERIO?: string;

  /** 시간표시작일자 (선택) */
  TI_FROM_YMD?: string;

  /** 시간표종료일자 (선택) */
  TI_TO_YMD?: string;
}

export interface SSTimeTableResponse extends BaseResponse {
  row: {
    /** 시도교육청코드 (필수) */
    ATPT_OFCDC_SC_CODE: string; // 학교를 관리하는 시도교육청 기관코드

    /** 시도교육청명 (필수) */
    ATPT_OFCDC_SC_NM: string; // 학교를 관리하는 시도교육청 명칭

    /** 행정표준코드 (필수) */
    SD_SCHUL_CODE: string; // 각급 기관의 행정업무에 필요한 행정코드를 표준화하여 정해진 절차에 따라 제정·고시한 행정코드

    /** 학교명 (필수) */
    SCHUL_NM: string; // 교육청에서 관리하는 학교의 명칭

    /** 학년도 (선택) */
    AY: string; // 한 학년의 과정을 배우는 기간

    /** 학기 (선택) */
    SEM: string; // 한 학년 동안을 학업의 필요에 의하여 구분한 기간

    /** 시간표일자 (선택) */
    ALL_TI_YMD: string; // 한 학기 동안 도표로 짜여진 학과목의 수업일

    /** 학교과정명 (선택) */
    SCHUL_CRSE_SC_NM: string; // 학교에서 운영 중인 교육과정 구분명

    /** 학년 (선택) */
    GRADE: string; // 1년 간의 학습 과정의 단위

    /** 강의실명 (선택) */
    CLRM_NM: string; // 학습활동이 이루어지는 장소

    /** 학급명 (선택) */
    CLASS_NM: string; // 한 교실에서 공부하는 학생으로 구성된 집단의 명칭

    /** 교시 (선택) */
    PERIO: string; // 학교의 수업시간을 세는 단위

    /** 수업내용 (선택) */
    ITRT_CNTNT: string; // 시간표에 따라 학급(반)별로 교사가 학생을 가르치는 모든 활동

    /** 수정일자 (선택) */
    LOAD_DTM: string; // 시간표 정보가 수정 및 저장된 일자
  }[];
}

export interface SSTimeTableRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string; // 학교를 관리하는 시도교육청 기관코드

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string; // 행정표준코드

  /** 학년도 (선택) */
  AY?: string; // 한 학년의 과정을 배우는 기간

  /** 학기 (선택) */
  SEM?: string; // 한 학년 동안을 학업의 필요에 의하여 구분한 기간

  /** 시간표일자 (선택) */
  ALL_TI_YMD?: string; // 한 학기 동안 도표로 짜여진 학과목의 수업일

  /** 학교과정명 (선택) */
  SCHUL_CRSE_SC_NM?: string; // 학교에서 운영 중인 교육과정 구분명

  /** 학년 (선택) */
  GRADE?: string; // 1년 간의 학습 과정의 단위

  /** 강의실명 (선택) */
  CLRM_NM?: string; // 학습활동이 이루어지는 장소

  /** 학급명 (선택) */
  CLASS_NM?: string; // 한 교실에서 공부하는 학생으로 구성된 집단의 명칭

  /** 교시 (선택) */
  PERIO?: string; // 학교의 수업시간을 세는 단위

  /** 시간표시작일자 (선택) */
  TI_FROM_YMD?: string;

  /** 시간표종료일자 (선택) */
  TI_TO_YMD?: string;
}

export interface TiClrminfoResponse extends BaseResponse {
  row: {
    /** 시도교육청코드 (시도교육청코드) */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 (시도교육청명) */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 (행정표준코드) */
    SD_SCHUL_CODE: string;

    /** 학교명 (학교명) */
    SCHUL_NM: string;

    /** 학년도 (학년도) */
    AY: string;

    /** 학년 (학년) */
    GRADE: string;

    /** 학기 (학기) */
    SEM: string;

    /** 학교과정명 (학교과정명) */
    SCHUL_CRSE_SC_NM: string;

    /** 주야과정명 (주야과정명) */
    DGHT_CRSE_SC_NM: string;

    /** 계열명 (계열명) */
    ORD_SC_NM: string;

    /** 학과명 (학과명) */
    DDDEP_NM: string;

    /** 강의실명 (강의실명) */
    CLRM_NM: string;

    /** 수정일자 (적재일시) */
    LOAD_DTM: string;
  }[];
}

export interface TiClrminfoRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string; // 행정표준코드

  /** 학년도 (선택) */
  AY?: string; // 학년도

  /** 학년 (선택) */
  GRADE?: string; // 학년

  /** 학기 (선택) */
  SEM?: string; // 학기

  /** 학교과정명 (선택) */
  SCHUL_CRSE_SC_NM?: string; // 학교과정명

  /** 주야과정명 (선택) */
  DGHT_CRSE_SC_NM?: string; // 주야과정명

  /** 계열명 (선택) */
  ORD_SC_NM?: string; // 계열명

  /** 학과명 (선택) */
  DDDEP_NM?: string; // 학과명
}

export interface AcademyResponse extends BaseResponse {
  row: {
    /** 시도교육청코드 (시도교육청코드) */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 (시도교육청명) */
    ATPT_OFCDC_SC_NM: string;

    /** 행정구역명 (행정구역명) */
    ADMST_ZONE_NM: string;

    /** 학원교습소명 (학원교습소명) */
    ACA_INSTI_SC_NM: string;

    /** 학원지정번호 (학원지정번호) */
    ACA_ASNUM: string;

    /** 학원명 (학원명) */
    ACA_NM: string;

    /** 개설일자 (개설일자) */
    ESTBL_YMD: string;

    /** 등록일자 (등록일자) */
    REG_YMD: string;

    /** 등록상태명 (등록상태명) */
    REG_STTUS_NM: string;

    /** 휴원시작일자 (휴원시작일자) */
    CAA_BEGIN_YMD: string;

    /** 휴원종료일자 (휴원종료일자) */
    CAA_END_YMD: string;

    /** 정원합계 (정원합계) */
    TOFOR_SMTOT: string;

    /** 일시수용능력인원합계 (일시수용능력인원합계) */
    DTM_RCPTN_ABLTY_NMPR_SMTOT: string;

    /** 분야명 (분야명) */
    REALM_SC_NM: string;

    /** 교습계열명 (교습계열명) */
    LE_ORD_NM: string;

    /** 교습과정목록명 (교습과정목록명) */
    LE_CRSE_LIST_NM: string;

    /** 교습과정명 (교습과정명) */
    LE_CRSE_NM: string;

    /** 인당수강료내용 (인당수강료내용) */
    PSNBY_THCC_CNTNT: string;

    /** 수강료공개여부 (수강료공개여부) */
    THCC_OTHBC_YN: string;

    /** 기숙사학원여부 (기숙사학원여부) */
    BRHS_ACA_YN: string;

    /** 도로명우편번호 (도로명우편번호) */
    FA_RDNZC: string;

    /** 도로명주소 (도로명주소) */
    FA_RDNMA: string;

    /** 도로명상세주소 (도로명상세주소) */
    FA_RDNDA: string;

    /** 수정일자 (적재일시) */
    LOAD_DTM: string;
  }[];
}

export interface AcademyRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드

  /** 행정구역명 (선택) */
  ADMST_ZONE_NM?: string; // 행정구역명

  /** 학원지정번호 (선택) */
  ACA_ASNUM?: string; // 학원지정번호

  /** 학원명 (선택) */
  ACA_NM?: string; // 학원명

  /** 분야명 (선택) */
  REALM_SC_NM?: string; // 분야명

  /** 교습계열명 (선택) */
  LE_ORD_NM?: string; // 교습계열명

  /** 교습과정명 (선택) */
  LE_CRSE_NM?: string; // 교습과정명
}

export interface MealResponse extends BaseResponse {
  row: {
    /** 시도교육청코드 (시도교육청코드) */
    ATPT_OFCDC_SC_CODE: string;

    /** 시도교육청명 (시도교육청명) */
    ATPT_OFCDC_SC_NM: string;

    /** 행정표준코드 (행정표준코드) */
    SD_SCHUL_CODE: string;

    /** 학교명 (학교명) */
    SCHUL_NM: string;

    /** 식사코드 (식사코드) */
    MMEAL_SC_CODE: string;

    /** 식사명 (식사명) */
    MMEAL_SC_NM: string;

    /** 급식일자 (급식일자) */
    MLSV_YMD: string;

    /** 급식인원수 (급식인원수) */
    MLSV_FGR: string;

    /** 요리명 (요리명) */
    DDISH_NM: string;

    /** 원산지정보 (원산지정보) */
    ORPLC_INFO: string;

    /** 칼로리정보 (칼로리정보) */
    CAL_INFO: string;

    /** 영양정보 (영양정보) */
    NTR_INFO: string;

    /** 급식시작일자 (급식시작일자) */
    MLSV_FROM_YMD: string;

    /** 급식종료일자 (급식종료일자) */
    MLSV_TO_YMD: string;

    /** 수정일자 (적재일시) */
    LOAD_DTM: string;
  }[];
}

export interface MealRequest extends BaseRequest {
  /** 시도교육청코드 (필수) */
  ATPT_OFCDC_SC_CODE: string; // 시도교육청구분코드

  /** 행정표준코드 (필수) */
  SD_SCHUL_CODE: string; // 행정표준코드

  /** 식사코드 (선택) */
  MMEAL_SC_CODE?: string; // 식사구분코드

  /** 급식일자 (선택) */
  MLSV_YMD?: string; // 급식일자

  /** 급식시작일자 (선택) */
  MLSV_FROM_YMD?: string; // 급식시작일자

  /** 급식종료일자 (선택) */
  MLSV_TO_YMD?: string; // 급식종료일자
}
