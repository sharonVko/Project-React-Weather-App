interface ILocation{
    name:        string;
    local_names: { [key: string]: string };
    lat:         number;
    lon:         number;
    country:     string;

}

export default ILocation;