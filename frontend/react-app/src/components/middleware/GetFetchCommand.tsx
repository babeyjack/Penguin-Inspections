import getDomain from "./GetDomain";

const GetFetchComamnd = (userCommand: string, companyCommand: string): string => {
    let fetchCommand = userCommand;
    const domain = getDomain();
    if(domain != "") fetchCommand = companyCommand;
    fetchCommand = fetchCommand.replace("${domain}", domain)

    return fetchCommand
}

export default GetFetchComamnd