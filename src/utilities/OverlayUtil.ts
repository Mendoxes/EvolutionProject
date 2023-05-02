export function a()
{
}

enum ChipValue
{
    Ten = 10,
    Fifty = 50,
    Hundred = 100,
    FiveHundred = 500
}

enum ChipColor
{
    Green = "green",
    Red = "red",
    Blue = "blue",
    Yellow = "yellow",
    Black = "black"
}

export function getChipColor(value: number): ChipColor
{
    let chipValue: ChipValue;
    switch (value)
    {
        case 10:
            chipValue = ChipValue.Ten;
            break;
        case 50:
            chipValue = ChipValue.Fifty;
            break;
        case 100:
            chipValue = ChipValue.Hundred;
            break;
        case 500:
            chipValue = ChipValue.FiveHundred;
            break;
        default:
            throw new Error("Invalid chip value");
    }
    switch (chipValue)
    {
        case ChipValue.Ten:
            return ChipColor.Blue;
        case ChipValue.Fifty:
            return ChipColor.Green;
        case ChipValue.Hundred:
            return ChipColor.Red;
        case ChipValue.FiveHundred:
            return ChipColor.Black;
        default:
            throw new Error("Invalid chip value");
    }
}