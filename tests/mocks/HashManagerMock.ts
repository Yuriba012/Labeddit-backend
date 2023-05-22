export class HashManagerMock {
    public hash = async (
      plaintext: string
    ): Promise<string> => {
      return "hash-mock"
    }

    public compare = async (
      plaintext: string,
      hash: string
    ): Promise<boolean> => {
      switch(plaintext) {
        case "user1password":
          return hash === "hash-mock-user1"

        case "user2password":
          return hash === "hash-mock-user2"

        case "user3password":
          return hash === "hash-mock-user3"
          
        default:
          return false
      }
    }
}