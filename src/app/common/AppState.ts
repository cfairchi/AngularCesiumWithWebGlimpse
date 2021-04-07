export class AppState {
  public static SELECTED_FILE = 'SELECTED_FILE';
  public static GLOBE_SPLIT_0 = 'GLOBE_SPLIT_0';
  public static GLOBE_SPLIT_1 = 'GLOBE_SPLIT_1';
  public static RESULT_SPLIT_0 = 'RESULT_SPLIT_0';
  public static RESULT_SPLIT_1 = 'RESULT_SPLIT_1';

  public static setSelectedAnalysisFile(selectedFile: string): void {
    localStorage.setItem('SELECTED_FILE', selectedFile);
  }

  public static getSelectedAnalysisFile(): string | null {
    return localStorage.getItem('SELECTED_FILE');
  }

  public static setGlobeSplit(values: number[]): void {
    localStorage.setItem(this.GLOBE_SPLIT_0, String(values[0]));
    localStorage.setItem(this.GLOBE_SPLIT_1, String(values[1]));
  }

  public static getGlobeSplit(): number[] {
    const val0 = localStorage.getItem(this.GLOBE_SPLIT_0);
    const val1 = localStorage.getItem(this.GLOBE_SPLIT_1);
    if (val0 && val1) {
      return [Number.parseFloat(val0), Number.parseFloat(val1)];
    } else {
      return [72, 28];
    }
  }

  public static setResultSplit(values: number[]): void {
    localStorage.setItem(this.RESULT_SPLIT_0, String(values[0]));
    localStorage.setItem(this.RESULT_SPLIT_1, String(values[1]));
  }

  public static getResultSplit(): number[] {
    const val0 = localStorage.getItem(this.RESULT_SPLIT_0);
    const val1 = localStorage.getItem(this.RESULT_SPLIT_1);
    if (val0 && val1) {
      return [Number.parseFloat(val0), Number.parseFloat(val1)];
    } else {
      return [20, 80];
    }
  }

}
