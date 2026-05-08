using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblRotaDuraklari
{
    public int RotaDurakId { get; set; }

    public int? RotaId { get; set; }

    public int? DurakId { get; set; }

    public int SiraNo { get; set; }

    public TimeOnly HedefVarisSaati { get; set; }

    public decimal? KilometreMesafesi { get; set; }

    public virtual TblDuraklar? Durak { get; set; }

    public virtual TblRotalar? Rota { get; set; }
}
