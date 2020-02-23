import fetch from "isomorphic-fetch";

export async function deploy() {
    // POST to our deploy hook
    // runs a new deployment on Zeit

    // TODO: use secrets manager for this for better security
    const response = await fetch(
        `https://api.zeit.co/v1/integrations/deploy/QmcTEQwxxshMcaJRYd39FJZiiAsi7Ph4FrpPFMbNoBTezM/peO52u2kmj`,
        {
            method: "POST"
        }
    ).then(res => res.json());

    console.log({ response });
}
