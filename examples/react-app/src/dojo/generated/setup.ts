import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { getSyncEntities } from "@dojoengine/react";
import { dojoClient } from "./generated";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { Config } from "../../../dojoConfig";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
    // Initialize the network configuration.
    const client = await dojoClient({
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        manifest: config.manifest,
    });

    // create contract components
    const contractComponents = defineContractComponents(world);

    // create client components
    const components = createClientComponents({ contractComponents });

    // fetch all existing entities from torii
    await getSyncEntities(client.toriiClient, contractComponents as any);

    return {
        client,
        components,
        contractComponents,
        systemCalls: createSystemCalls(client, contractComponents, components),
        config,
    };
}
