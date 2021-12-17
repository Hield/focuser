export interface MomentNote {
  videoTimestamp: number;
  imageUrl: string;
}

export interface SessionNote {
  videoUrl: string;
  moments: MomentNote[];
}
