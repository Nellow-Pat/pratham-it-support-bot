export const IServer = Symbol('IServer');

export interface IServer {
    start(): void;
}