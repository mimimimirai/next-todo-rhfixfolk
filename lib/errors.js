export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const handleApiError = (error, res) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  console.error(error);
  return NextResponse.json(
    { error: '予期せぬエラーが発生しました' },
    { status: 500 }
  );
}; 